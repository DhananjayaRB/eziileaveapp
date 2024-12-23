import express, { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { LeaveOrganisation } from "../../entity/LeaveOrganisation";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../middlewares/require-auth";
const router = express.Router();

router.get(
  "/api/comp-off-variant-details/:id",
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
          compOff: true,
          compOffVariants: true,
        },
      });

      if (!organisation || !organisation.compOffVariants) {
        return res
          .status(404)
          .json({ message: "Organisation or comp-off variants not found" });
      }

      const compOffVariant = organisation.compOffVariants?.find(
        (variant) => variant.id === Number(id)
      );

      if (!compOffVariant) {
        return res.status(404).json({
          message: "Comp-off variant not found within this organisation",
        });
      }

      res.status(200).json(compOffVariant);
    } catch (error) {
      console.error("Error fetching comp-off variant by id:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as getCompOffVariantByIdRouter };
