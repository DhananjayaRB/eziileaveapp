import express, { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { LeaveVariant } from "../../../entity/LeaveVariant";
import { LeaveVariantSchema } from "./validations";
import { LeaveType } from "../../../entity/LeaveType";
import { EntityType, ActionType } from "../../../entity/AuditLogger";
import { AuditLogger } from "../../../service/audit-logger";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../../middlewares/require-auth";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";
import { Balances } from "../../../entity/Balances";

const router = express.Router();

router.post(
  "/api/leave-variant/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const user = (req as AuthenticatedRequest).user;

    const { error, value } = LeaveVariantSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: {
          leaveTypes: true,
          leaveVariants: {
            leaveType: true,
          },
        },
      });

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const leaveType = organisation.leaveTypes.find(
        (type) => type.id === parseInt(id)
      );

      if (!leaveType) {
        return res.status(404).json({
          message:
            "Leave type not found or does not belong to this organisation",
        });
      }

      if (!Array.isArray(organisation.leaveVariants)) {
        organisation.leaveVariants = [];
      }

      const existingVariant = organisation.leaveVariants.find((variant) => {
        if (!variant || !variant.leaveType) {
          return false;
        }
        return (
          variant.leaveType.id === leaveType.id &&
          variant.variantName.toLowerCase() === value.variantName.toLowerCase()
        );
      });

      if (existingVariant) {
        return res.status(400).json({
          message: `A variant named "${value.variantName}" already exists for this leave type`,
        });
      }

      if (value.assignedTo && value.assignedTo.length > 0) {
        const employeeVariant = organisation.leaveVariants?.find((variant) => {
          if (!variant || !variant.leaveType) {
            return false;
          }
          return (
            variant.leaveType.id === leaveType.id &&
            variant.assignedTo?.some((employee) =>
              value.assignedTo.includes(employee)
            )
          );
        });

        if (employeeVariant) {
          return res.status(400).json({
            message: `Some employees are already assigned to variant "${employeeVariant.variantName}" of this leave type`,
          });
        }
      }

      const leaveVariant = AppDataSource.getRepository(LeaveVariant).create({
        ...value,
        leaveType,
        organisation,
      });

      const savedVariant = (await AppDataSource.getRepository(
        LeaveVariant
      ).save(leaveVariant)) as any as LeaveVariant;

      leaveType.variantCount += 1;
      await AppDataSource.getRepository(LeaveType).save(leaveType);

      if (!organisation.leaveVariants) {
        organisation.leaveVariants = [];
      }

      organisation.leaveVariants.push(savedVariant);
      organisation.setupPercentage = Number(organisation.setupPercentage) + 15;
      await AppDataSource.getRepository(LeaveOrganisation).save(organisation);

      await AuditLogger.log({
        entityType: EntityType.LEAVE_VARIANT,
        entityId: savedVariant.id,
        action: ActionType.CREATE,
        previousState: null,
        newState: savedVariant,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        orgId: user.org_id,
        request: req,
      });

      if (value.assignedTo && value.assignedTo.length > 0) {
        const balancesRepository = AppDataSource.getRepository(Balances);

        for (const employee of value.assignedTo) {
          let balance = await balancesRepository.findOne({
            where: { employee_number: employee.employee_number },
          });

          if (!balance) {
            balance = balancesRepository.create({
              employee_number: employee.employee_number,
              leaveBalances: {},
              compOffBalances: {},
              ptoBalances: {},
              organisation,
            });
          }

          balance.leaveBalances = {
            ...balance.leaveBalances,
            [savedVariant.id]: {
              total: savedVariant.paidDaysInAYear,
              used: 0,
              pending: 0,
            },
          };

          await balancesRepository.save(balance);
        }
      }

      res.status(201).json(savedVariant);
    } catch (error) {
      console.error("Error creating leave variant:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as newLeaveVariantRouter };
