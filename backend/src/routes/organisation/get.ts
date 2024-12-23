import express, { RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { LeaveOrganisation } from "../../entity/LeaveOrganisation";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../../middlewares/require-auth";

const router = express.Router();

const getOrganisation: RequestHandler = async (req, res) => {
  const user = (req as AuthenticatedRequest).user;

  // changes to be made
  /**
   * right now, the role_id for an admin is 289, and an employee is 300
   * so, here's what i need you to do, check the role_id in the user object
   * - if its 289, perform the same logic as we have right now
   * - if its 300, perform the logic im outlining here
   * -- since the user accessing this endpoint is an employee, they dont need information that admins do, so we need to only show them data they need to know
   * -- data that the user needs to know: leave variants that the current user is eligible for: that can be fetched
   */

  try {
    const organisation = await AppDataSource.getRepository(
      LeaveOrganisation
    ).findOne({
      where: { orgId: user.org_id },
      relations: {
        leaveTypes: {
          variants: true,
        },
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
