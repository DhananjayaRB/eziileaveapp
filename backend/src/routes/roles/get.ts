import { Response, Router } from "express";
import { AppDataSource } from "../../data-source";
import { LeaveOrganisation } from "../../entity/LeaveOrganisation";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../middlewares/require-auth";

const router = Router();

router.get(
  "/api/roles",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
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

      if (!organisation || !organisation.roles) {
        return res.status(404).json({ message: "Roles not found" });
      }

      res.status(200).json(organisation.roles);
    } catch (err: unknown) {
      console.error("Error fetching roles:", err);
      res
        .status(500)
        .json({ message: "Error fetching roles", error: err.message });
    }
  }
);

export { router as getRoleRouter };
