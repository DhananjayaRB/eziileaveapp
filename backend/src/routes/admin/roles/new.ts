import axios from "axios";
import { Response, Router } from "express";
import https from "https";

import { AppDataSource } from "../../../data-source";
import { ActionType, EntityType } from "../../../entity/AuditLogger";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";
import { Role } from "../../../entity/Roles";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../../middlewares/require-auth";
import { AuditLogger } from "../../../service/audit-logger";
import {
  RESOLVE_EMPLOYEE_API,
  RESOLVE_EMPLOYEE_API_BODY,
  RESOLVE_MAPPING,
  RESOLVE_TOKEN,
} from "../../../utils/server-urls";
import { AssignedTo, EmployeeAPIResponse } from "../../../utils/types";
import { roleValidationSchema } from "./validations";

const router = Router();

router.post(
  "/api/roles",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = req.user;
    const { error, value } = roleValidationSchema.validate(req.body);

    if (error)
      return res.status(400).json({ message: error.details[0].message });

    try {
      const organisation = await AppDataSource.getRepository(
        LeaveOrganisation
      ).findOne({
        where: { orgId: user.org_id },
        relations: {
          roles: true,
        },
      });

      if (!organisation) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      const RESOLVE_FILTERS = {};

      for (const [key, mappedValue] of Object.entries(RESOLVE_MAPPING)) {
        if (value[key] && Array.isArray(value[key]) && value[key].length > 0) {
          RESOLVE_FILTERS[mappedValue] = value[key];
        }
      }

      const REVISED_RESOLVE_BODY = {
        ...RESOLVE_EMPLOYEE_API_BODY,
        Filters: [RESOLVE_FILTERS],
      };

      const config = {
        headers: {
          Authorization: RESOLVE_TOKEN,
          "Content-Type": "application/json",
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      } as const;

      const resolveResponse = await axios.post<EmployeeAPIResponse>(
        RESOLVE_EMPLOYEE_API,
        REVISED_RESOLVE_BODY,
        config
      );

      const employees = resolveResponse.data.data.data;

      const essentialInformation: AssignedTo[] = employees.map((employee) => ({
        employee_number: employee.employee_number,
        name: employee.user_name,
      }));

      const uniqueUsers = new Set([
        ...value.assignedTo,
        ...essentialInformation,
      ]);

      const role = AppDataSource.getRepository(Role).create({
        ...value,
        organisation: organisation,
        assignedTo: Array.from(uniqueUsers),
        createdBy: {
          id: user.user_id,
        },
      });

      const savedRole = (await AppDataSource.getRepository(Role).save(
        role
      )) as any as Role;

      if (!organisation.roles) {
        organisation.roles = [];
      }
      organisation.roles.push(savedRole);
      organisation.setupPercentage = Number(organisation.setupPercentage) + 15; // MODIFY % HERE (INITIALLY 15)
      await AppDataSource.getRepository(LeaveOrganisation).save(organisation);

      await AuditLogger.log({
        entityType: EntityType.ROLE,
        entityId: savedRole.id,
        action: ActionType.CREATE,
        previousState: null,
        newState: savedRole,
        performedBy: {
          id: user.user_id,
          name: user.user_id,
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(201).json(savedRole);
    } catch (error) {
      console.error("Error creating role:", error);
      res
        .status(500)
        .json({ message: "Error creating role", error: error.message });
    }
  }
);

export { router as newRoleRouter };
