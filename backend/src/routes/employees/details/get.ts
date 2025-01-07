import { Response, Router } from "express";
import { AppDataSource } from "../../../data-source";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../../middlewares/require-auth";

const router = Router();

router.get(
  "/api/employee/leave-details",
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
          ptoVariants: true,
          compOffVariants: true,
        },
      });

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const assignedLeaveTypes = organisation.leaveTypes
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

      const assignedPtoVariants = organisation.ptoVariants
        ?.filter((variant) =>
          variant.assignedTo?.some(
            (assignee) => assignee.employee_number === user.user_id
          )
        )
        .map((variant) => ({
          id: variant.id,
          name: variant.variantName,
        }));

      const assignedCompOffVariants = organisation.compOffVariants
        ?.filter((variant) =>
          variant.assignedTo?.some(
            (assignee) => assignee.employee_number === user.user_id
          )
        )
        .map((variant) => ({
          id: variant.id,
          name: variant.variantName,
        }));

      const response = {
        user_id: user.user_id,
        leaves: assignedLeaveTypes,
        ptoVariants: assignedPtoVariants || [],
        compoffVariants: assignedCompOffVariants || [],
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error("Error fetching employee leave details:", error);
      res.status(500).json({
        message: "Error fetching leave details",
        error: error.message,
      });
    }
  }
);

export { router as getEmployeeLeaveDetailsRouter };
