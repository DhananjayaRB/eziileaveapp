import express, { RequestHandler } from "express";
import { AppDataSource } from "../../../data-source";
import { ActionType, EntityType } from "../../../entity/AuditLogger";
import { CompOff } from "../../../entity/CompOff";
import { LeaveOrganisation } from "../../../entity/LeaveOrganisation";
import { LeaveType } from "../../../entity/LeaveType";
import { PTO } from "../../../entity/PTO";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../../middlewares/require-auth";
import { AuditLogger } from "../../../service/audit-logger";

const router = express.Router();

const data = [
  {
    name: "Sick Leave",
  },
  {
    name: "Casual Leave",
  },
  {
    name: "Earned Leave",
  },
  {
    name: "Maternity Leave",
  },
  {
    name: "Paternity Leave",
  },
  {
    name: "Marriage Leave",
  },
  {
    name: "Bereavement Leave",
  },
];

const createOrganisation: RequestHandler = async (req, res) => {
  const user = (req as AuthenticatedRequest).user;

  try {
    const existingOrg = await AppDataSource.getRepository(
      LeaveOrganisation
    ).findOne({
      where: { orgId: user.org_id },
    });

    if (existingOrg) {
      res
        .status(400)
        .json({ message: "Organisation with this ID already exists" });
      return;
    }

    const ptoRepository = AppDataSource.getRepository(PTO);
    const compOffRepository = AppDataSource.getRepository(CompOff);
    const leaveTypeRepository = AppDataSource.getRepository(LeaveType);

    const pto = ptoRepository.create({
      name: "PTO",
      isEnabled: false,
      variantCount: 0,
    });

    const compOff = compOffRepository.create({
      name: "Comp Off",
      isEnabled: false,
      variantCount: 0,
    });

    const savedPTO = await ptoRepository.save(pto);
    const savedCompOff = await compOffRepository.save(compOff);

    const organisation = AppDataSource.getRepository(LeaveOrganisation).create({
      orgId: user.org_id,
      setupPercentage: 0,
      createdBy: {
        id: user.user_id,
      },
      pto: savedPTO,
      compOff: savedCompOff,
    });

    const savedOrganisation = await AppDataSource.getRepository(
      LeaveOrganisation
    ).save(organisation);

    const leaveTypes = await Promise.all(
      data.map(async (leaveData) => {
        const leaveType = leaveTypeRepository.create({
          name: leaveData.name,
          organisation: savedOrganisation,
        });
        return await leaveTypeRepository.save(leaveType);
      })
    );

    savedOrganisation.leaveTypes = leaveTypes;
    const updatedOrganisation = await AppDataSource.getRepository(
      LeaveOrganisation
    ).save(savedOrganisation);

    await AuditLogger.log({
      entityType: EntityType.ORGANISATION,
      entityId: savedOrganisation.id,
      action: ActionType.CREATE,
      newState: savedOrganisation,
      performedBy: {
        id: user.user_id,
        name: user.user_id,
      },
      request: req,
      orgId: user.org_id,
    });

    res.status(201).json(updatedOrganisation);
  } catch (error) {
    console.error("Error creating organisation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

router.post("/api/organisation", requireAuth, createOrganisation);

export { router as newOrganisationRouter };
