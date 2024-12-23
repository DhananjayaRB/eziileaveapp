import express, { Response } from "express";
import { AppDataSource } from "../../data-source";
import { ActionType, EntityType } from "../../entity/AuditLogger";
import { LeaveOrganisation } from "../../entity/LeaveOrganisation";
import { PTOVariant } from "../../entity/PTOVariant";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../middlewares/require-auth";
import { AuditLogger } from "../../service/audit-logger";
import { PTOVariantSchema } from "./validations";

const router = express.Router();

router.patch(
  "/api/pto-variant/:id",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = req.user;
    const { id } = req.params;
    const { error, value } = PTOVariantSchema.validate(req.body);

    if (error) res.status(400).json({ message: error.details[0].message });

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

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const ptoVariant = await AppDataSource.getRepository(PTOVariant).findOne({
        where: { id: Number(id) },
        relations: ["pto", "organisation"],
      });

      if (!ptoVariant) {
        return res.status(404).json({ message: "PTO variant not found" });
      }

      Object.assign(ptoVariant, value);
      const savedPTOVariant = await AppDataSource.getRepository(
        PTOVariant
      ).save(ptoVariant);

      const variantIndex = organisation.ptoVariants.findIndex(
        (variant) => variant.id === savedPTOVariant.id
      );

      if (variantIndex !== -1) {
        organisation.ptoVariants[variantIndex] = savedPTOVariant;
        await AppDataSource.getRepository(LeaveOrganisation).save(organisation);
      }

      await AuditLogger.log({
        entityType: EntityType.PTO_VARIANT,
        entityId: savedPTOVariant.id,
        action: ActionType.UPDATE,
        newState: savedPTOVariant,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(200).json(savedPTOVariant);
    } catch (error) {
      console.error("Error updating PTO variant:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);

export { router as patchPTOVariantRouter };
