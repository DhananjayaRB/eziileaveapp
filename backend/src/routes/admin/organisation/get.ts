import express, { RequestHandler } from "express";
import { AppDataSource } from "../../../data-source";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../../../middlewares/require-auth";

const router = express.Router();

const getOrganisation: RequestHandler = async (req, res) => {
  const user = (req as AuthenticatedRequest).user;

  try {
    const organisation = await AppDataSource.getRepository(
      LeaveOrganisation
    ).findOne({
      where: { orgId: user.org_id },
      relations: {
        leaveTypes: {
          variants: true,
        },
        applications: true,
        leaveVariants: {
          leaveType: true,
        },
        ptoVariants: true,
        compOffVariants: true,
        pto: true,
        compOff: true,
        roles: true,
        workflows: true,
      },
    });

    if (!organisation) {
      res.status(404).json({ message: "Organisation not found" });
      return;
    }

    res.status(200).json(organisation);
  } catch (error) {
    console.error("Error fetching organisation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

router.get("/api/organisation", requireAuth, getOrganisation);

export { router as getOrganisationRouter };
