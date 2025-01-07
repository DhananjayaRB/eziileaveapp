import { Response, Router } from "express";
import { AppDataSource } from "../../../../data-source";
import {
  Applications,
  ApplicationStatus,
} from "../../../../entity/Applications";
import { ActionType, EntityType } from "../../../../entity/AuditLogger";
import { LeaveOrganisation } from "../../../../entity/LeaveOrganisation";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../../../middlewares/require-auth";
import { AuditLogger } from "../../../../service/audit-logger";

const router = Router();

interface ApproveRejectBody {
  approve: boolean;
  message?: string;
}

router.post(
  "/api/workflow-applications/:id",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const { id } = req.params;
    const { approve, message }: ApproveRejectBody = req.body;
    const user = req.user;

    try {
      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: {
          roles: true,
        },
      });

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const application = await AppDataSource.getRepository(
        Applications
      ).findOne({
        where: { id: parseInt(id) },
        relations: ["workflow"],
      });

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      const userRoles = organisation.roles.filter((role) =>
        role.assignedTo?.some(
          (assigned) => assigned.employee_number === user.user_id
        )
      );

      const hasPermission = application.currentStep?.assignedRoles.some(
        (stepRole) => userRoles.some((userRole) => userRole.id === stepRole.id)
      );

      if (!hasPermission) {
        return res.status(403).json({
          message:
            "You don't have the necessary permissions to perform this operation",
        });
      }

      const previousState = { ...application };

      if (!approve) {
        application.status = ApplicationStatus.REJECTED;
        application.message = message || "Application rejected";
        application.currentStep = null;
      } else {
        if (
          !application.workflow?.steps ||
          application.workflow.steps.length === 1 ||
          application.currentStep?.autoApproval
        ) {
          application.status = ApplicationStatus.APPROVED;
          application.currentStep = null;
        } else {
          const currentStepIndex = application.workflow.steps.findIndex(
            (step) => step.id === application.currentStep?.id
          );

          if (currentStepIndex < application.workflow.steps.length - 1) {
            const nextStep = application.workflow.steps[currentStepIndex + 1];
            application.currentStep = nextStep;

            //  if (application.currentStep.forwardToNext) {
            //    const { days, hours } = application.currentStep.forwardAfter;
            //    // TODO: Implement scheduler for auto-forwarding
            //  }
          } else {
            application.status = ApplicationStatus.APPROVED;
            application.currentStep = null;
          }
        }
      }

      application.updatedAt = new Date();

      const updatedApplication = await AppDataSource.getRepository(
        Applications
      ).save(application);

      await AuditLogger.log({
        entityType: EntityType.APPLICATION,
        entityId: application.id,
        action: ActionType.UPDATE,
        previousState,
        newState: updatedApplication,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(200).json(updatedApplication);
    } catch (error) {
      console.error("Error processing application approval:", error);
      res
        .status(500)
        .json({ message: "Error processing application approval" });
    }
  }
);

export { router as approveWorkflowApplicationRouter };
