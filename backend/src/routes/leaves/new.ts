import express, { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { LeaveType } from "../../entity/LeaveType";
import { ActionType, EntityType } from "../../entity/AuditLogger";
import { AuditLogger } from "../../service/audit-logger";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../../middlewares/require-auth";
import { LeaveOrganisation } from "../../entity/LeaveOrganisation";
const router = express.Router();

router.post(
  "/api/leave-type",
  requireAuth,
  async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    try {
      const { name } = req.body;

      if (!name) {
        res.status(400).json({ message: "Name is required" });
      }

      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: ["leaveTypes"],
      });

      if (!organisation) {
        res.status(404).json({ message: "Organisation not found" });
        return;
      }

      const leaveTypeRepository = AppDataSource.getRepository(LeaveType);

      const leaveType = leaveTypeRepository.create({
        name,
        organisation: organisation, // Associate with organization
      });

      const savedLeaveType = await leaveTypeRepository.save(leaveType);

      organisation.leaveTypes = [...organisation.leaveTypes, savedLeaveType];
      await AppDataSource.getRepository(LeaveOrganisation).save(organisation);

      await AuditLogger.log({
        entityType: EntityType.LEAVE_TYPE,
        entityId: savedLeaveType.id,
        action: ActionType.CREATE,
        previousState: null,
        newState: savedLeaveType,
        performedBy: {
          id: user.user_id,
          name: user.role_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(201).json(savedLeaveType);
    } catch (error) {
      console.error("Error creating leave type:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as newLeaveTypeRouter };
