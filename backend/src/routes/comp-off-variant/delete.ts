import express, { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { CompOffVariant } from "../../entity/CompOffVariant";
import { CompOff } from "../../entity/CompOff";
import { ActionType, EntityType } from "../../entity/AuditLogger";
import { AuditLogger } from "../../service/audit-logger";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../../middlewares/require-auth";
import { LeaveOrganisation } from "../../entity/LeaveOrganisation";

const router = express.Router();

router.delete(
  "/api/comp-off-variant/:id",
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
        where: { id: parseInt(id) },
        relations: ["compOff", "organisation"],
      });

      if (!compOffVariant) {
        return res.status(404).json({ message: "Comp-off variant not found" });
      }

      const compOff = compOffVariant.compOff;
      compOff.variantCount -= 1;
      await AppDataSource.getRepository(CompOff).save(compOff);

      organisation.compOffVariants = organisation.compOffVariants.filter(
        (variant) => variant.id !== compOffVariant.id
      );
      organisation.setupPercentage = Number(organisation.setupPercentage) - 15;
      await AppDataSource.getRepository(LeaveOrganisation).save(organisation);

      const deletedCompOffVariant = await AppDataSource.getRepository(
        CompOffVariant
      ).remove(compOffVariant);

      await AuditLogger.log({
        entityType: EntityType.COMP_OFF_VARIANT,
        entityId: parseInt(id),
        action: ActionType.DELETE,
        previousState: compOffVariant,
        newState: null,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res
        .status(200)
        .json({ message: "Comp-off variant deleted successfully" });
    } catch (error) {
      console.error("Error deleting comp-off variant:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as deleteCompOffVariantRouter };
