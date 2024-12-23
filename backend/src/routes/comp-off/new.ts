import express, { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { ActionType, EntityType } from "../../entity/AuditLogger";
import { CompOff } from "../../entity/CompOff";
import { AuditLogger } from "../../service/audit-logger";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../middlewares/require-auth";

const router = express.Router();

const compOffData = {
  name: "Comp Off",
  isEnabled: false,
  variantCount: 0,
};

router.post(
  "/api/comp-off",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = req.user;
    try {
      const compOffRepository = AppDataSource.getRepository(CompOff);

      const compOff = compOffRepository.create(compOffData);
      const savedCompOff = await compOffRepository.save(compOff);

      await AuditLogger.log({
        entityType: EntityType.COMP_OFF,
        entityId: savedCompOff.id,
        action: ActionType.CREATE,
        newState: savedCompOff,
        performedBy: {
          id: "savedCompOff.createdBy.id",
          name: "savedCompOff.createdBy.name",
        },
        request: req,
        orgId: user.org_id,
      });

      res.status(201).json(compOff);
    } catch (error: any) {
      console.error("Error creating comp off:", error);
      res
        .status(500)
        .json({ message: "Creation failed", error: error.message });
    }
  }
);

export { router as newCompOffRouter };
