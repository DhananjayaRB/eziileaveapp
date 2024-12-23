import express, { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { LeaveOrganisation } from "../../entity/LeaveOrganisation";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../middlewares/require-auth";

const router = express.Router();

router.get(
  "/api/workflow",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
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
        return res.status(404).json({ message: "Workflows not found" });
      }

      res.status(200).json(organisation.workflows);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);

export { router as getWorkflowRouter };
