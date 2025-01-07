import express, { Response } from "express";
import { AppDataSource } from "../../../data-source";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../../middlewares/require-auth";

const router = express.Router();

router.get(
  "/api/pto",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = (req as AuthenticatedRequest).user;

    try {
      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: {
          pto: true,
        },
      });

      if (!organisation || !organisation.pto) {
        return res.status(404).json({ message: "PTO record not found" });
      }

      res.status(200).json(organisation.pto);
    } catch (error: any) {
      console.error("Error updating PTO:", error);
      res.status(500).json({ message: "Update failed", error: error.message });
    }
  }
);

export { router as getPtoRouter };
