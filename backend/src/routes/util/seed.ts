import express, { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { LeaveType } from "../../entity/LeaveType";
import { CompOff } from "../../entity/CompOff";
import { PTO } from "../../entity/PTO";

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

const compOffData = {
  name: "Comp Off",
  isEnabled: false,
  variantCount: 0,
};

const ptoData = {
  name: "PTO",
  isEnabled: false,
  variantCount: 0,
};

router.post("/api/seed", async (req: Request, res: Response) => {
  try {
    const leaveTypeRepository = AppDataSource.getRepository(LeaveType);
    const compOffRepository = AppDataSource.getRepository(CompOff);
    const ptoRepository = AppDataSource.getRepository(PTO);

    const compOff = compOffRepository.create({
      ...compOffData,
    });
    await compOffRepository.save(compOff);

    const seededLeaveTypes = [];
    for (const leaveData of data) {
      const leaveType = leaveTypeRepository.create(leaveData); // Create a new LeaveType instance
      await leaveTypeRepository.save(leaveType); // Save to the database
      seededLeaveTypes.push(leaveType);
    }

    const pto = ptoRepository.create(ptoData);
    await ptoRepository.save(pto);

    console.log("Database Seeded Successfully");

    res.status(201).json({
      message: "Seed completed",
      leaveTypes: seededLeaveTypes,
      compOff,
      pto,
    });
  } catch (error: unknown) {
    console.error("Error seeding data:", error);
    res.status(500).json({ message: "Seeding failed", error: error.message });
  }
});

export { router as seedRouter };
