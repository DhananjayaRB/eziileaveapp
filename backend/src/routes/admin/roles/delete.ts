import { Response, Router } from "express";
import { AppDataSource } from "../../../data-source";
import { ActionType, EntityType } from "../../../entity/AuditLogger";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";
import { Role } from "../../../entity/Roles";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../../middlewares/require-auth";
import { AuditLogger } from "../../../service/audit-logger";

const router = Router();

router.delete(
  "/api/roles/:id",
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
          roles: true,
        },
      });

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const role = await AppDataSource.getRepository(Role).findOne({
        where: { id: Number(id) },
        relations: ["organisation"],
      });

      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }

      organisation.roles = organisation.roles.filter((r) => r.id !== role.id);
      organisation.setupPercentage = Number(organisation.setupPercentage) - 15;
      await AppDataSource.getRepository(LeaveOrganisation).save(organisation);

      const deletedRole = await AppDataSource.getRepository(Role).remove(role);

      await AuditLogger.log({
        entityType: EntityType.ROLE,
        entityId: Number(id),
        action: ActionType.DELETE,
        previousState: role,
        newState: null,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(200).json({ message: "Role deleted successfully" });
    } catch (err: any) {
      console.error("Error deleting role:", err);
      res
        .status(500)
        .json({ message: "Error deleting role", error: err.message });
    }
  }
);

export { router as deleteRoleRouter };
