import express, { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { LeaveType } from "../../../entity/LeaveType";
import {
  requireAuth,
  AuthenticatedRequest,
} from "../../../middlewares/require-auth";
const router = express.Router();

router.get(
  "/api/leave-type",
  requireAuth,
  async (req: Request, res: Response): Promise<any> => {
    const user = (req as AuthenticatedRequest).user;

    try {
      if (user.role_name === "employee") {
        return res
          .status(403)
          .json({ message: "You are not authorized to access this resource" });
      } else if (user.role_name === "admin") {
        const leaveTypeRepository = AppDataSource.getRepository(LeaveType);
        const leaveTypes = await leaveTypeRepository.find({
          where: { organisation: { orgId: user.org_id } },
          relations: ["organisation"],
        });

        res.status(200).json(leaveTypes);
      }
    } catch (error) {
      console.error("Error fetching leave types:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as getLeaveTypesRouter };
