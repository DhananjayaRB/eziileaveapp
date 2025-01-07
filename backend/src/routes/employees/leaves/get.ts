import { Response, Router } from "express";
import { AppDataSource } from "../../../data-source";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../../middlewares/require-auth";

const router = Router();

router.get(
  "/api/employee/leaves",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = req.user;

    try {
      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: {
          leaveTypes: {
            variants: true,
          },
        },
      });

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const assignedLeaveVariants = organisation.leaveTypes
        .filter((leaveType) =>
          leaveType.variants?.some((variant) =>
            variant.assignedTo?.some(
              (assignee) => assignee.employee_number === user.user_id
            )
          )
        )
        .map((leaveType) => ({
          id: leaveType.id,
          name: leaveType.name,
          variants: leaveType.variants
            ?.filter((variant) =>
              variant.assignedTo?.some(
                (assignee) => assignee.employee_number === user.user_id
              )
            )
            .map((variant) => ({
              id: variant.id,
              name: variant.variantName,
            })),
        }));

      res.status(200).json(assignedLeaveVariants);
    } catch (error: any) {
      console.error("Error fetching employee leaves:", error);
      res.status(500).json({
        message: "Error fetching leaves",
        error: error.message,
      });
    }
  }
);

export { router as getEmployeeLeavesRouter };
