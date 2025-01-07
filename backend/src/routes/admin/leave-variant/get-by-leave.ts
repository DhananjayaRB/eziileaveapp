import express, { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";
import { LeaveVariant } from "../../../entity/LeaveVariant";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../../middlewares/require-auth";

const router = express.Router();

router.get(
  "/api/leave-variant/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const user = (req as AuthenticatedRequest).user;

    try {
      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: {
          leaveTypes: true,
          leaveVariants: true,
        },
      });

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const leaveType = organisation.leaveTypes.find(
        (type) => type.id === parseInt(id)
      );

      if (!leaveType) {
        return res.status(404).json({
          message:
            "Leave type not found or does not belong to this organisation",
        });
      }

      const leaveVariants = await AppDataSource.getRepository(
        LeaveVariant
      ).find({
        where: { leaveType: { id: leaveType.id } },
        relations: ["leaveType", "organisation"],
      });

      res.status(200).json({
        leaveType,
        variants: leaveVariants,
      });
    } catch (error) {
      console.error("Error fetching leave variant by leave type:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as getLeaveVariantByLeaveTypeRouter };
