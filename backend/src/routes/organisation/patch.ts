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

const updateOrganisation: RequestHandler = async (req, res) => {
  const user = (req as AuthenticatedRequest).user;
  const updateData = req.body;

  try {
    const organisation = await AppDataSource.getRepository(
      LeaveOrganisation
    ).findOne({
      where: { orgId: user.org_id },
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

    const previousState = { ...organisation };
    Object.assign(organisation, { ...updateData, setupPercentage: 15 });

    const updatedOrganisation = await AppDataSource.getRepository(
      LeaveOrganisation
    ).save(organisation);

    await AuditLogger.log({
      entityType: EntityType.ORGANISATION,
      entityId: organisation.id,
      action: ActionType.UPDATE,
      previousState,
      newState: updatedOrganisation,
      performedBy: {
        id: user.user_id,
        name: user.role_id,
      },
      request: req,
      orgId: user.org_id,
    });

    res.status(200).json(updatedOrganisation);
  } catch (error) {
    console.error("Error updating organisation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

router.patch("/api/organisation", requireAuth, updateOrganisation);

export { router as patchOrganisationRouter };
