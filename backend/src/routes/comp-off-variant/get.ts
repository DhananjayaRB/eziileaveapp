import express, { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { CompOffVariant } from "../../entity/CompOffVariant";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../../middlewares/require-auth";
import { LeaveOrganisation } from "../../entity/LeaveOrganisation";

const router = express.Router();

router.get(
  "/api/comp-off-variant",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = req.user;
    try {
      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: {
          compOffVariants: true,
          compOff: true,
        },
      });

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const variants = await AppDataSource.getRepository(CompOffVariant).find({
        where: { organisation: { id: organisation.id } },
        relations: ["compOff", "organisation"],
      });

      res.status(200).json(variants);
    } catch (error) {
      console.error("Error fetching comp-off variants:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);

export { router as getCompOffVariantRouter };
