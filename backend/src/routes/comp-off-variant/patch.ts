import express, { Response } from "express";
import { AppDataSource } from "../../data-source";
import { ActionType, EntityType } from "../../entity/AuditLogger";
import { CompOffVariant } from "../../entity/CompOffVariant";
import { LeaveOrganisation } from "../../entity/LeaveOrganisation";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../middlewares/require-auth";
import { AuditLogger } from "../../service/audit-logger";
import { CompOffVariantSchema } from "./validations";

const router = express.Router();

router.patch(
  "/api/comp-off-variant/:id",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = req.user;
    const { id } = req.params;
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

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const compOffVariant = await AppDataSource.getRepository(
        CompOffVariant
      ).findOne({
        where: { id: Number(id) },
        relations: ["compOff", "organisation"],
      });

      if (!compOffVariant) {
        return res.status(404).json({ message: "Comp-off variant not found" });
      }

      Object.assign(compOffVariant, value);
      const savedCompOffVariant = await AppDataSource.getRepository(
        CompOffVariant
      ).save(compOffVariant);

      // Update the variant in organisation's compOffVariants array
      const variantIndex = organisation.compOffVariants.findIndex(
        (variant) => variant.id === savedCompOffVariant.id
      );

      if (variantIndex !== -1) {
        organisation.compOffVariants[variantIndex] = savedCompOffVariant;
        await AppDataSource.getRepository(LeaveOrganisation).save(organisation);
      }

      await AuditLogger.log({
        entityType: EntityType.COMP_OFF_VARIANT,
        entityId: savedCompOffVariant.id,
        action: ActionType.UPDATE,
        newState: savedCompOffVariant,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(200).json(savedCompOffVariant);
    } catch (error) {
      console.error("Error updating comp-off variant:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);

export { router as patchCompOffVariantRouter };
