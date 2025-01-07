import { Response, Router } from "express";
import { AppDataSource } from "../../../data-source";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";
import { Applications } from "../../../entity/Applications";
import { ActionType, EntityType } from "../../../entity/AuditLogger";
import { AuditLogger } from "../../../service/audit-logger";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../../middlewares/require-auth";

const router = Router();

router.delete(
  "/api/employee/leave-applications/:id",
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
          applications: true,
        },
      });

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const application = await AppDataSource.getRepository(
        Applications
      ).findOne({
        where: { id: parseInt(id) },
        relations: ["organisation"],
      });

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      if (application.organisation.id !== organisation.id) {
        return res.status(403).json({
          message: "Application does not belong to this organisation",
        });
      }

      const isAuthorized =
        application.createdBy === user.user_id ||
        (application.behalfOfSomeoneElse &&
          application.behalfOfSomeoneElse.employee.employee_number ===
            user.user_id);

      if (!isAuthorized) {
        return res.status(403).json({
          message: "Not authorized to delete this application",
        });
      }

      organisation.applications = organisation.applications.filter(
        (app) => app.id !== application.id
      );
      await AppDataSource.getRepository(LeaveOrganisation).save(organisation);

      const deletedApplication = await AppDataSource.getRepository(
        Applications
      ).remove(application);

      await AuditLogger.log({
        entityType: EntityType.APPLICATION,
        entityId: parseInt(id),
        action: ActionType.DELETE,
        previousState: application,
        newState: null,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(200).json({ message: "Application deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting application:", error);
      res.status(500).json({
        message: "Error deleting application",
        error: error.message,
      });
    }
  }
);

export { router as deleteLeaveApplicationRouter };
