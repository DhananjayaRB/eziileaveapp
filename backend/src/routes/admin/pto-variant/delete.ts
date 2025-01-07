import express, { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { PTOVariant } from "../../../entity/PTOVariant";
import { PTO } from "../../../entity/PTO";
import { ActionType, EntityType } from "../../../entity/AuditLogger";
import { AuditLogger } from "../../../service/audit-logger";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../../../middlewares/require-auth";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";

const router = express.Router();

router.delete(
  "/api/pto-variant/:id",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const { id } = req.params;
    const user = req.user;

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
        where: { id: parseInt(id) },
        relations: ["pto", "organisation"],
      });

      if (!ptoVariant) {
        return res.status(404).json({ message: "PTO variant not found" });
      }

      const pto = ptoVariant.pto;
      pto.variantCount -= 1;
      await AppDataSource.getRepository(PTO).save(pto);

      organisation.ptoVariants = organisation.ptoVariants.filter(
        (variant) => variant.id !== ptoVariant.id
      );
      organisation.setupPercentage = Number(organisation.setupPercentage) - 15;
      await AppDataSource.getRepository(LeaveOrganisation).save(organisation);

      const deletedPTOVariant = await AppDataSource.getRepository(
        PTOVariant
      ).remove(ptoVariant);

      await AuditLogger.log({
        entityType: EntityType.PTO_VARIANT,
        entityId: parseInt(id),
        action: ActionType.DELETE,
        previousState: ptoVariant,
        newState: null,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(200).json({ message: "PTO variant deleted successfully" });
    } catch (error) {
      console.error("Error deleting PTO variant:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as deletePTOVariantRouter };
