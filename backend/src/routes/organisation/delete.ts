import express, { RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { LeaveOrganisation } from "../../entity/LeaveOrganisation";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../../middlewares/require-auth";
import { ActionType, EntityType } from "../../entity/AuditLogger";
import { AuditLogger } from "../../service/audit-logger";

const router = express.Router();

const deleteOrganisation: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = (req as AuthenticatedRequest).user;

  try {
    const organisation = await AppDataSource.getRepository(
      LeaveOrganisation
    ).findOne({
      where: { id: parseInt(id) },
      relations: [
        "leaveTypes",
        "leaveVariants",
        "compOffVariants",
        "ptoVariants",
        "roles",
        "workflows",
        "pto",
        "compOff",
      ],
    });

    if (!organisation) {
      res.status(404).json({ message: "Organisation not found" });
      return;
    }

    const organisationState = { ...organisation };

    await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        if (organisation.leaveVariants?.length) {
          await transactionalEntityManager.remove(organisation.leaveVariants);
        }
        if (organisation.compOffVariants?.length) {
          await transactionalEntityManager.remove(organisation.compOffVariants);
        }
        if (organisation.ptoVariants?.length) {
          await transactionalEntityManager.remove(organisation.ptoVariants);
        }
        if (organisation.leaveTypes?.length) {
          await transactionalEntityManager.remove(organisation.leaveTypes);
        }
        if (organisation.roles?.length) {
          await transactionalEntityManager.remove(organisation.roles);
        }
        if (organisation.workflows?.length) {
          await transactionalEntityManager.remove(organisation.workflows);
        }
        if (organisation.pto) {
          await transactionalEntityManager.remove(organisation.pto);
        }
        if (organisation.compOff) {
          await transactionalEntityManager.remove(organisation.compOff);
        }

        await transactionalEntityManager.remove(organisation);
      }
    );

    await AuditLogger.log({
      entityType: EntityType.ORGANISATION,
      entityId: parseInt(id),
      action: ActionType.DELETE,
      previousState: organisationState,
      newState: null,
      performedBy: {
        id: user.user_id,
        name: user.role_id,
      },
      request: req,
      orgId: user.org_id,
    });

    res.status(200).json({ message: "Organisation deleted successfully" });
  } catch (error) {
    console.error("Error deleting organisation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

router.delete("/api/organisation/:id", requireAuth, deleteOrganisation);

export { router as deleteOrganisationRouter };
