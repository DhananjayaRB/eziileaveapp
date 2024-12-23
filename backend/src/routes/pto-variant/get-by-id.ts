import express, { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { LeaveOrganisation } from "../../entity/LeaveOrganisation";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../middlewares/require-auth";
const router = express.Router();

router.get(
  "/api/pto-variant-details/:id",
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
          pto: true,
          ptoVariants: true,
        },
      });

      if (!organisation || !organisation.ptoVariants) {
        return res
          .status(404)
          .json({ message: "Organisation or PTO variants not found" });
      }

      const ptoVariant = organisation.ptoVariants?.find(
        (variant) => variant.id === Number(id)
      );

      if (!ptoVariant) {
        return res.status(404).json({
          message: "PTO variant not found within this organisation",
        });
      }

      res.status(200).json(ptoVariant);
    } catch (error) {
      console.error("Error fetching PTO variant by id:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as getPTOVariantByIdRouter };
