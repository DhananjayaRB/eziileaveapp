import express, { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { LeaveType } from "../../../entity/LeaveType";
import { ActionType, EntityType } from "../../../entity/AuditLogger";
import { AuditLogger } from "../../../service/audit-logger";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../../../middlewares/require-auth";

const router = express.Router();

router.patch(
  "/api/leave-type/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;
    const { name, isActive } = req.body;

    try {
      const leaveTypeRepository = AppDataSource.getRepository(LeaveType);

      const leaveType = await leaveTypeRepository.findOneBy({
        id: parseInt(req.params.id),
      });

      if (!leaveType) {
        res.status(404).json({ message: "Leave type not found" });
      }

      if (name !== undefined) {
        leaveType.name = name;
      }

      if (isActive !== undefined) {
        leaveType.isEnabled = Boolean(isActive);
      }

      const editedLeaveType = await leaveTypeRepository.save(leaveType);

      await AuditLogger.log({
        entityType: EntityType.LEAVE_TYPE,
        entityId: editedLeaveType.id,
        action: ActionType.UPDATE,
        previousState: leaveType,
        newState: editedLeaveType,
        performedBy: {
          id: user.user_id,
          name: user.role_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(200).json(editedLeaveType);
    } catch (error) {
      console.error("Error updating leave type:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as patchLeaveTypeRouter };
