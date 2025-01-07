import { Response, Router } from "express";
import { AppDataSource } from "../../../../data-source";
import {
  Applications,
  ApplicationStatus,
} from "../../../../entity/Applications";
import { LeaveOrganisation } from "../../../../entity/LeaveOrganisation";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../../../middlewares/require-auth";

const router = Router();

router.get(
  "/api/workflow-applications",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = req.user;

    try {
      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: {
          roles: true,
          workflows: true,
          applications: {
            workflow: true,
          },
        },
      });

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const userRoles = organisation.roles.filter((role) =>
        role.assignedTo?.some(
          (assigned) => assigned.employee_number === user.user_id
        )
      );

      const applications = await AppDataSource.getRepository(Applications)
        .createQueryBuilder("application")
        .leftJoinAndSelect("application.workflow", "workflow")
        .leftJoinAndSelect("application.organisation", "organisation")
        .where("organisation.id = :orgId", { orgId: organisation.id })
        .andWhere("application.status = :status", {
          status: ApplicationStatus.PENDING,
        })
        .getMany();

      const actionableApplications = applications.filter((application) => {
        if (!application.workflow || !application.currentStep) return false;

        const stepRoleIds = application.currentStep.assignedRoles.map(
          (role) => role.id
        );
        return userRoles.some((role) => stepRoleIds.includes(role.id));
      });

      res.status(200).json(actionableApplications);
    } catch (error) {
      console.error("Error fetching workflow applications:", error);
      res.status(500).json({ message: "Error fetching workflow applications" });
    }
  }
);

export { router as getWorkflowApplicationsRouter };
