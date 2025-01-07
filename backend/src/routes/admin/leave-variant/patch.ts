import express, { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { LeaveVariant } from "../../../entity/LeaveVariant";
import { LeaveVariantSchema } from "./validations";
import { ActionType, EntityType } from "../../../entity/AuditLogger";
import { AuditLogger } from "../../../service/audit-logger";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../../../middlewares/require-auth";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";

const router = express.Router();

router.patch(
  "/api/leave-variant/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const user = (req as AuthenticatedRequest).user;

    const { error, value } = LeaveVariantSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    try {
      const leaveVariant = await AppDataSource.getRepository(
        LeaveVariant
      ).findOne({
        where: { id: parseInt(id) },
        relations: ["leaveType", "organisation"],
      });

      if (!leaveVariant) {
        return res.status(404).json({ message: "Leave variant not found" });
      }

      const previousState = { ...leaveVariant };

      Object.assign(leaveVariant, value);
      const savedLeaveVariant = await AppDataSource.getRepository(
        LeaveVariant
      ).save(leaveVariant);

      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: {
          leaveTypes: true,
          leaveVariants: {
            leaveType: true,
          },
        },
      });

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const variants: any[] = Array.isArray(organisation.leaveVariants)
        ? organisation.leaveVariants
        : Object.values(organisation.leaveVariants);

      const variantIndex = variants.findIndex((variant) => {
        console.log("Comparing:", variant.id, savedLeaveVariant.id);
        return variant.id === savedLeaveVariant.id;
      });

      if (variantIndex !== -1) {
        variants[variantIndex] = savedLeaveVariant;
        organisation.leaveVariants = variants;
        await AppDataSource.getRepository(LeaveOrganisation).save(organisation);
      }

      await AuditLogger.log({
        entityType: EntityType.LEAVE_VARIANT,
        entityId: savedLeaveVariant.id,
        action: ActionType.UPDATE,
        previousState,
        newState: savedLeaveVariant,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(200).json(savedLeaveVariant);
    } catch (error) {
      console.error("Error updating leave variant:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as patchLeaveVariantRouter };
