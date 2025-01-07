import express, { Response } from "express";
import { AppDataSource } from "../../../data-source";
import { ActionType, EntityType } from "../../../entity/AuditLogger";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";
import { PTO } from "../../../entity/PTO";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../../middlewares/require-auth";
import { AuditLogger } from "../../../service/audit-logger";

const router = express.Router();

router.patch(
  "/api/pto",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const { isEnabled } = req.body;
    const user = (req as AuthenticatedRequest).user;

    try {
      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: {
          pto: true,
        },
      });

      if (!organisation || !organisation.pto) {
        return res.status(404).json({ message: "PTO record not found" });
      }

      const pto = organisation.pto;
      pto.isEnabled = isEnabled;
      const savedPto = await AppDataSource.getRepository(PTO).save(pto);

      await AuditLogger.log({
        entityType: EntityType.PTO,
        entityId: savedPto.id,
        action: ActionType.UPDATE,
        newState: savedPto,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(200).json(savedPto);
    } catch (error: any) {
      console.error("Error updating PTO:", error);
      res.status(500).json({ message: "Update failed", error: error.message });
    }
  }
);

export { router as patchPtoRouter };
