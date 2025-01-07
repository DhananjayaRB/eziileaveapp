import { Response, Router } from "express";
import { AppDataSource } from "../../../data-source";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";
import { Applications, ApplicationStatus } from "../../../entity/Applications";
import { Workflow } from "../../../entity/Workflow";
import { ActionType, EntityType } from "../../../entity/AuditLogger";
import { AuditLogger } from "../../../service/audit-logger";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../../middlewares/require-auth";
import { applicationValidationSchema } from "./validations";

const router = Router();

router.post(
  "/api/employee/leave-applications",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = req.user;
    const { error, value } = applicationValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: {
          applications: true,
          workflows: true,
        },
      });

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const matchingWorkflow = organisation.workflows?.find(
        (workflow) =>
          workflow.process === "Applications" &&
          workflow.subProcess === "Apply for Leave"
      );

      const application = AppDataSource.getRepository(Applications).create({
        ...value,
        status: ApplicationStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user.user_id,
        organisation,
        workflow: matchingWorkflow || null,
        currentStep: matchingWorkflow?.steps[0] || null,
        
        compOffDate: value.compOffDate || null,
        fromTime: value.fromTime || null,
        toTime: value.toTime || null,
        reasonForCompOff: value.reasonForCompOff || null,
      });

      const savedApplication = (await AppDataSource.getRepository(
        Applications
      ).save(application)) as any as Applications;

      const mergedApplications = organisation.applications
        ? [...organisation.applications, savedApplication]
        : [savedApplication];

      organisation.applications = mergedApplications as Applications[];
      await AppDataSource.getRepository(LeaveOrganisation).save(organisation);

      await AuditLogger.log({
        entityType: EntityType.APPLICATION,
        entityId: savedApplication.id,
        action: ActionType.CREATE,
        previousState: null,
        newState: savedApplication,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(201).json(savedApplication);
    } catch (err) {
      console.error("Error creating leave application:", err);
      res.status(500).json({ message: "Error creating leave application" });
    }
  }
);

export { router as newLeaveApplicationRouter };
