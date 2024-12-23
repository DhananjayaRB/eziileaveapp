import express, { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { CompOffVariant } from "../../entity/CompOffVariant";
import { CompOff } from "../../entity/CompOff";
import { CompOffVariantSchema } from "./validations";
import { ActionType, EntityType } from "../../entity/AuditLogger";
import { AuditLogger } from "../../service/audit-logger";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../../middlewares/require-auth";
import { LeaveOrganisation } from "../../entity/LeaveOrganisation";

const router = express.Router();

router.post(
  "/api/comp-off-variant",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = req.user;
    const { error, value } = CompOffVariantSchema.validate(req.body);

    if (error)
      return res.status(400).json({ message: error.details[0].message });

    try {
      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: {
          compOff: true,
          compOffVariants: true,
        },
      });

      if (!organisation || !organisation.compOff) {
        return res
          .status(404)
          .json({ message: "Organisation or CompOff not found" });
      }

      const compOffVariant = AppDataSource.getRepository(CompOffVariant).create(
        {
          ...value,
          compOff: organisation.compOff,
          organisation: organisation,
        }
      );

      const savedVariant = (await AppDataSource.getRepository(
        CompOffVariant
      ).save(compOffVariant)) as any as CompOffVariant;

      organisation.compOff.variantCount += 1;
      await AppDataSource.getRepository(CompOff).save(organisation.compOff);

      if (!organisation.compOffVariants) {
        organisation.compOffVariants = [];
      }
      organisation.compOffVariants.push(savedVariant);
      organisation.setupPercentage = Number(organisation.setupPercentage) + 15;

      await AppDataSource.getRepository(LeaveOrganisation).save(organisation);

      const auditVariant = {
        id: savedVariant.id,
        variantName: savedVariant.variantName,
        description: savedVariant.description,
        allowNonWorkingDays: savedVariant.allowNonWorkingDays,
        approvalRequestsMadeBefore: savedVariant.approvalRequestsMadeBefore,
        assignedTo: savedVariant.assignedTo,
        availedWithin: savedVariant.availedWithin,
        carryForwardEnabled: savedVariant.carryForwardEnabled,
        carryForwardLapseIn: savedVariant.carryForwardLapseIn,
        carryForwardToNextCycle: savedVariant.carryForwardToNextCycle,
        compOffsDuringNoticePeriod: savedVariant.compOffsDuringNoticePeriod,
        compensationEnabled: savedVariant.compensationEnabled,
        compensationOptions: savedVariant.compensationOptions,
        maxCompOffApplications: savedVariant.maxCompOffApplications,
        maxDaysThatCanBeEncashed: savedVariant.maxDaysThatCanBeEncashed,
        minimumHoursRequired: savedVariant.minimumHoursRequired,
        requiresReviewWorkflow: savedVariant.requiresReviewWorkflow,
        unitsAllowed: savedVariant.unitsAllowed,
        withdrawalOfApplicationAllowed:
          savedVariant.withdrawalOfApplicationAllowed,
        compOffId: savedVariant.compOff.id,
        organisationId: organisation.id,
      };

      await AuditLogger.log({
        entityType: EntityType.COMP_OFF_VARIANT,
        entityId: savedVariant.id,
        action: ActionType.CREATE,
        previousState: null,
        newState: auditVariant,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(201).json(savedVariant);
    } catch (error) {
      console.error("Error creating comp-off variant:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as newCompOffVariantRouter };
