import express, { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { Workflow } from "../../../entity/Workflow";
import { AuditLogger } from "../../../service/audit-logger";
import { EntityType, ActionType } from "../../../entity/AuditLogger";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../../../middlewares/require-auth";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";

const router = express.Router();

router.delete(
  "/api/workflow/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const user = (req as AuthenticatedRequest).user;

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

      const workflow = await AppDataSource.getRepository(Workflow).findOne({
        where: { id: Number(id) },
        relations: ["organisation"],
      });

      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }

      organisation.workflows = organisation.workflows.filter(
        (w) => w.id !== workflow.id
      );
      organisation.setupPercentage = Number(organisation.setupPercentage) - 15;
      await AppDataSource.getRepository(LeaveOrganisation).save(organisation);

      const deletedWorkflow = await AppDataSource.getRepository(
        Workflow
      ).remove(workflow);

      await AuditLogger.log({
        entityType: EntityType.WORKFLOW,
        entityId: Number(id),
        action: ActionType.DELETE,
        previousState: workflow,
        newState: null,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(200).json({ message: "Workflow deleted successfully" });
    } catch (error) {
      console.error("Error deleting workflow:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as deleteWorkflowRouter };
