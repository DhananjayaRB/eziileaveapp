import express, { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { PTOVariant } from "../../../entity/PTOVariant";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../../../middlewares/require-auth";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";

const router = express.Router();

router.get(
  "/api/pto-variant",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = req.user;
    try {
      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: {
          ptoVariants: true,
          pto: true,
        },
      });

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const variants = await AppDataSource.getRepository(PTOVariant).find({
        where: { organisation: { id: organisation.id } },
        relations: ["pto", "organisation"],
      });

      res.status(200).json(variants);
    } catch (error) {
      console.error("Error fetching PTO variants:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);

export { router as getPTOVariantRouter };
