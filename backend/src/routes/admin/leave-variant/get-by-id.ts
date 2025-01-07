import express, { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../../middlewares/require-auth";
const router = express.Router();

router.get(
  "/api/leave-variant-details/:id",
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
          leaveVariants: true,
        },
      });

      if (!organisation || !organisation.leaveVariants) {
        return res
          .status(404)
          .json({ message: "Organisation or leave variants not found" });
      }

      const leaveVariant = organisation.leaveVariants?.find(
        (variant) => variant.id === Number(id)
      );

      if (!leaveVariant) {
        return res.status(404).json({
          message: "Leave variant not found within this organisation",
        });
      }

      res.status(200).json(leaveVariant);
    } catch (error) {
      console.error("Error fetching leave variant by id:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as getLeaveVariantByIdRouter };
