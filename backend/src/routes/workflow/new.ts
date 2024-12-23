import { Response, Router } from "express";
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

const router = Router();

router.post(
  "/api/workflow",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = req.user;
    const workflowData = req.body;

    const { error, value } = workflowValidationSchema.validate(workflowData);
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

      const workflow = AppDataSource.getRepository(Workflow).create({
        ...value,
        organisation: organisation,
        createdBy: {
          id: user.user_id,
        },
      });

      const savedWorkflow = (await AppDataSource.getRepository(Workflow).save(
        workflow
      )) as any as Workflow;

      if (!organisation.workflows) {
        organisation.workflows = [];
      }
      organisation.workflows.push(savedWorkflow);
      organisation.setupPercentage = Number(organisation.setupPercentage) + 15; // MODIFY % HERE (INITIALLY 15)
      await AppDataSource.getRepository(LeaveOrganisation).save(organisation);

      await AuditLogger.log({
        entityType: EntityType.WORKFLOW,
        entityId: savedWorkflow.id,
        action: ActionType.CREATE,
        previousState: null,
        newState: savedWorkflow,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(201).json(savedWorkflow);
    } catch (err: any) {
      console.error("Error creating workflow:", err);
      res
        .status(500)
        .json({ message: "Error creating workflow", error: err.message });
    }
  }
);

export { router as newWorkflowRouter };
