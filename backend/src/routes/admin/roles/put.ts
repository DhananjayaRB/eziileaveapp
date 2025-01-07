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
import { roleValidationSchema } from "./validations";

const router = Router();

router.put(
  "/api/roles/:id",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const { id } = req.params;
    const roleDetails = req.body;
    const user = req.user;

    const { error, value } = roleValidationSchema.validate(roleDetails);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

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

      const roleIndex = organisation.roles.findIndex(
        (role) => role.id === Number(id)
      );

      if (roleIndex === -1) {
        return res
          .status(404)
          .json({ message: "Role not found within this organisation" });
      }

      const existingRole = organisation.roles[roleIndex];

      const updatedRole = await AppDataSource.getRepository(Role).save({
        ...existingRole,
        ...value,
      });

      organisation.roles[roleIndex] = updatedRole;
      await AppDataSource.getRepository(LeaveOrganisation).save(organisation);

      await AuditLogger.log({
        entityType: EntityType.ROLE,
        entityId: updatedRole.id,
        action: ActionType.UPDATE,
        previousState: existingRole,
        newState: updatedRole,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(200).json(updatedRole);
    } catch (error) {
      console.error("Error updating role:", error);
      res
        .status(500)
        .json({ message: "Failed to update role", error: error.message });
    }
  }
);

export { router as putRoleRouter };
