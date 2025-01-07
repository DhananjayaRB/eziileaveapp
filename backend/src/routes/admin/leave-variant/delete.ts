import express, { Response } from "express";
import { AppDataSource } from "../../../data-source";
import { LeaveVariant } from "../../../entity/LeaveVariant";
import { LeaveType } from "../../../entity/LeaveType";
import { ActionType, EntityType } from "../../../entity/AuditLogger";
import { AuditLogger } from "../../../service/audit-logger";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../../../middlewares/require-auth";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";

const router = express.Router();

router.delete(
  "/api/leave-variant/:id",
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
          leaveTypes: true,
          leaveVariants: true,
        },
      });

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const leaveVariant = await AppDataSource.getRepository(
        LeaveVariant
      ).findOne({
        where: { id: parseInt(id) },
        relations: ["leaveType", "organisation"],
      });

      if (!leaveVariant) {
        return res.status(404).json({ message: "Leave variant not found" });
      }

      const leaveType = leaveVariant.leaveType;
      leaveType.variantCount -= 1;
      await AppDataSource.getRepository(LeaveType).save(leaveType);

      organisation.setupPercentage = Number(organisation.setupPercentage) - 15;

      organisation.leaveVariants = organisation.leaveVariants.filter(
        (variant) => variant.id !== leaveVariant.id
      );
      await AppDataSource.getRepository(LeaveOrganisation).save(organisation);

      const deletedLeaveVariant = await AppDataSource.getRepository(
        LeaveVariant
      ).remove(leaveVariant);

      await AuditLogger.log({
        entityType: EntityType.LEAVE_VARIANT,
        entityId: parseInt(id),
        action: ActionType.DELETE,
        previousState: leaveVariant,
        newState: null,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(200).json({ message: "Leave variant deleted successfully" });
    } catch (error) {
      console.error("Error deleting leave variant:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as deleteLeaveVariantRouter };
