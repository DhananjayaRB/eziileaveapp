import { Router, Request, Response } from "express";
import { Workflow } from "../../../entity/Workflow";
import { AppDataSource } from "../../../data-source";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../../middlewares/require-auth";

const router = Router();

router.get(
  "/api/workflow/:id",
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
          workflows: true,
        },
      });

      if (!organisation || !organisation.workflows) {
        return res
          .status(404)
          .json({ message: "Organisation or workflows not found" });
      }

      const workflow = organisation.workflows?.find(
        (workflow) => workflow.id === Number(id)
      );

      if (!workflow) {
        return res
          .status(404)
          .json({ message: "Workflow not found within this organisation" });
      }

      res.status(200).json(workflow);
    } catch (err: any) {
      console.error("Error fetching workflow by ID:", err);
      res
        .status(500)
        .json({ message: "Error fetching workflow", error: err.message });
    }
  }
);

export { router as getWorkflowByIdRouter };
