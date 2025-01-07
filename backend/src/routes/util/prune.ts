import express, { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { LeaveType } from "../../entity/LeaveType";
import { LeaveVariant } from "../../entity/LeaveVariant";
// import { Employee } from "../../entity/Employee"; // Add all your entities here

const router = express.Router();

router.delete("/api/prune", async (req: Request, res: Response) => {
  try {
    const entities = [
      LeaveVariant,
      LeaveType,
      // Employee /* add other entities here */,
    ];

    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity);
      await repository.clear();
    }

    res.status(200).json({ message: "All data cleared from the database" });
  } catch (error) {
    console.error("Error pruning database:", error);
    res.status(500).json({ message: "Pruning failed", error: error.message });
  }
});

export { router as pruneRouter };
