import express, { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { ActionType, EntityType } from "../../entity/AuditLogger";
import { CompOff } from "../../entity/CompOff";
import { AuditLogger } from "../../service/audit-logger";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../../middlewares/require-auth";
import { LeaveOrganisation } from "../../entity/LeaveOrganisation";

const router = express.Router();

router.patch(
  "/api/comp-off",
  requireAuth,
  async (req: Request, res: Response): Promise<any> => {
    const { isEnabled } = req.body;
    const user = (req as AuthenticatedRequest).user;

    try {
      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: {
          compOff: true,
        },
      });

      if (!organisation || !organisation.compOff) {
        return res.status(404).json({ message: "CompOff record not found" });
      }

      const compOff = organisation.compOff;
      compOff.isEnabled = isEnabled;
      const savedCompOff = await AppDataSource.getRepository(CompOff).save(
        compOff
      );

      await AuditLogger.log({
        entityType: EntityType.COMP_OFF,
        entityId: savedCompOff.id,
        action: ActionType.UPDATE,
        newState: savedCompOff,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(200).json(savedCompOff);
    } catch (error: unknown) {
      console.error("Error updating CompOff:", error);
      res.status(500).json({ message: "Update failed", error: error.message });
    }
  }
);

export { router as patchCompOffRouter };
