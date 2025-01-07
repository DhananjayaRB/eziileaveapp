import { Response, Router } from "express";
import { AppDataSource } from "../../../data-source";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";
import { Applications } from "../../../entity/Applications";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../../middlewares/require-auth";

const router = Router();

router.get(
  "/api/employee/leave-applications",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = req.user;

    try {
      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
      });

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const applications = await AppDataSource.getRepository(Applications).find(
        {
          where: { organisation: { id: organisation.id } },
          order: { createdAt: "DESC" },
        }
      );

      const userApplications = applications.filter(
        (application) =>
          application.createdBy === user.user_id ||
          (application.behalfOfSomeoneElse &&
            application.behalfOfSomeoneElse.employee.employee_number ===
              user.user_id)
      );

      res.status(200).json(userApplications);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      res.status(500).json({
        message: "Error fetching applications",
        error: error.message,
      });
    }
  }
);

export { router as getLeaveApplicationsRouter };
