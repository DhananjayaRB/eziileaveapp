import { Response, Router } from "express";
import { AppDataSource } from "../../../data-source";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../../middlewares/require-auth";

const router = Router();

router.get(
  "/api/roles/:id",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = req.user;
    const { id } = req.params;

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
        return res
          .status(404)
          .json({ message: "Organisation or roles not found" });
      }

      const role = organisation.roles?.find((role) => role.id === Number(id));

      if (!role) {
        return res
          .status(404)
          .json({ message: "Role not found within this organisation" });
      }

      res.status(200).json(role);
    } catch (err: any) {
      console.error("Error fetching role by ID:", err);
      res
        .status(500)
        .json({ message: "Error fetching role", error: err.message });
    }
  }
);

export { router as getRoleByIdRouter };
