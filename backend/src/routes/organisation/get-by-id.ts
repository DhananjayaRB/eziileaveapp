import express, { RequestHandler } from "express";
import { AppDataSource } from "../../data-source";
import { LeaveOrganisation } from "../../entity/LeaveOrganisation";
import { requireAuth } from "../../middlewares/require-auth";

const router = express.Router();

const getOrganisation: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const organisation = await AppDataSource.getRepository(
      LeaveOrganisation
    ).findOne({
      where: { id: parseInt(id) },
      relations: [
        "leaveTypes",
        "leaveVariants",
        "compOffVariants",
        "ptoVariants",
        "roles",
        "workflows",
        "pto",
        "compOff",
      ],
    });

    if (!organisation) {
      res.status(404).json({ message: "Organisation not found" });
      return;
    }

    res.status(200).json(organisation);
  } catch (error) {
    console.error("Error fetching organisation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

router.get("/api/organisation/:id", requireAuth, getOrganisation);

export { router as getOrganisationByIdRouter };
