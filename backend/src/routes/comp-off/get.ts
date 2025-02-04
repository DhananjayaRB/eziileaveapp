import express, { Response } from "express";
import { AppDataSource } from "../../data-source";
import { LeaveOrganisation } from "../../entity/LeaveOrganisation";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../middlewares/require-auth";

const router = express.Router();

router.get(
  "/api/comp-off",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = (req as AuthenticatedRequest).user;

    try {
      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: {
          compOff: true,
        },
      });

      if (!organisation || !organisation.compOff) {
        return res.status(404).json({ message: "CompOff record not found" });
      }

      res.status(200).json(organisation.compOff);
    } catch (error: unknown) {
      console.error("Error fetching CompOff:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export { router as getCompOffRouter };
