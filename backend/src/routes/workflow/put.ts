import express, { Response } from "express";
import { AppDataSource } from "../../data-source";
import { ActionType, EntityType } from "../../entity/AuditLogger";
import { LeaveOrganisation } from "../../entity/LeaveOrganisation";
import { Workflow } from "../../entity/Workflow";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../middlewares/require-auth";
import { AuditLogger } from "../../service/audit-logger";
import { workflowValidationSchema } from "./validations";

const router = express.Router();

router.put(
  "/api/workflow/:id",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const { id } = req.params;
    const workflowDetails = req.body;
    const user = req.user;

    const { error, value } = workflowValidationSchema.validate(workflowDetails);

    if (error)
      return res.status(400).json({ message: error.details[0].message });

    try {
      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: {
          workflows: true,
        },
      });

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const workflowIndex = organisation.workflows.findIndex(
        (workflow) => workflow.id === Number(id)
      );

      if (workflowIndex === -1) {
        return res
          .status(404)
          .json({ message: "Workflow not found within this organisation" });
      }

      const existingWorkflow = organisation.workflows[workflowIndex];

      const updatedWorkflow = await AppDataSource.getRepository(Workflow).save({
        ...existingWorkflow,
        ...value,
      });

      organisation.workflows[workflowIndex] = updatedWorkflow;
      await AppDataSource.getRepository(LeaveOrganisation).save(organisation);

      await AuditLogger.log({
        entityType: EntityType.WORKFLOW,
        entityId: updatedWorkflow.id,
        action: ActionType.UPDATE,
        previousState: existingWorkflow,
        newState: updatedWorkflow,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(200).json(updatedWorkflow);
    } catch (error) {
      console.error("Error updating workflow:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);

export { router as putWorkflowRouter };
