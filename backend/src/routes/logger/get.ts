import { Response, Router } from "express";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../../middlewares/require-auth";
import { AuditLogger } from "../../service/audit-logger";

const router = Router();

router.get(
  "/api/logs",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      const { entityType, entityId, userId, limit } = req.query;

      let logs;
      if (entityType && entityId) {
        logs = await AuditLogger.getLogsByEntity(
          entityType as any,
          Number(entityId),
          user.org_id
        );
      } else if (userId) {
        logs = await AuditLogger.getLogsByUser(userId as string, user.org_id);
      } else {
        logs = await AuditLogger.getRecentLogs(
          user.org_id,
          limit ? Number(limit) : undefined
        );
      }

      res.json(logs);
    } catch (err: any) {
      console.error("Error fetching logs:", err);
      res
        .status(500)
        .json({ message: "Error fetching logs", error: err.message });
    }
  }
);

export { router as getLogsRouter };
