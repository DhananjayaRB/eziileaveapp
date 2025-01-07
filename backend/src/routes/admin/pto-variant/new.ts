import express, { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { PTO } from "../../../entity/PTO";
import { PTOVariant } from "../../../entity/PTOVariant";
import { PTOVariantSchema } from "./validations";
import { ActionType, EntityType } from "../../../entity/AuditLogger";
import { AuditLogger } from "../../../service/audit-logger";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../../../middlewares/require-auth";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";

const router = express.Router();

router.post(
  "/api/pto-variant",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = req.user;
    const { error, value } = PTOVariantSchema.validate(req.body);

    if (error)
      return res.status(400).json({ message: error.details[0].message });

    try {
      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: {
          pto: true,
          ptoVariants: true,
        },
      });

      if (!organisation || !organisation.pto) {
        return res
          .status(404)
          .json({ message: "Organisation or PTO not found" });
      }

      const ptoVariant = AppDataSource.getRepository(PTOVariant).create({
        ...value,
        pto: organisation.pto,
        organisation: organisation,
      });

      const savedVariant = (await AppDataSource.getRepository(PTOVariant).save(
        ptoVariant
      )) as any as PTOVariant;

      organisation.pto.variantCount += 1;
      await AppDataSource.getRepository(PTO).save(organisation.pto);

      if (!organisation.ptoVariants) {
        organisation.ptoVariants = [];
      }
      organisation.ptoVariants.push(savedVariant);
      organisation.setupPercentage = Number(organisation.setupPercentage) + 15;
      await AppDataSource.getRepository(LeaveOrganisation).save(organisation);

      await AuditLogger.log({
        entityType: EntityType.PTO_VARIANT,
        entityId: savedVariant.id,
        action: ActionType.CREATE,
        previousState: null,
        newState: savedVariant,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(201).json(savedVariant);
    } catch (error) {
      console.error("Error creating PTO variant:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as newPTOVariantRouter };
