import express, { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { PTO } from "../../entity/PTO";

const router = express.Router();

const ptoData = {
  name: "PTO",
  isEnabled: false,
  variantCount: 0,
};

router.post("/api/pto", async (req: Request, res: Response) => {
  try {
    const ptoRepository = AppDataSource.getRepository(PTO);

    const pto = ptoRepository.create(ptoData);
    await ptoRepository.save(pto);

    res.status(201).json(pto);
  } catch (error: unknown) {
    console.error("Error creating pto:", error);
    res.status(500).json({ message: "Creation failed", error: error.message });
  }
});

export { router as newPtoRouter };
