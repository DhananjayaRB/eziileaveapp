import { AppDataSource } from "../data-source";
import { AuditLog, EntityType, ActionType } from "../entity/AuditLogger";
import { Request } from "express";

export class AuditLogger {
  private static repository = AppDataSource.getRepository(AuditLog);

  static async log({
    entityType,
    entityId,
    action,
    previousState = null,
    newState,
    performedBy,
    reason,
    request,
    orgId,
  }: {
    entityType: EntityType;
    entityId: number;
    action: ActionType;
    previousState?: object | null;
    newState: object;
    performedBy: {
      id: string;
      name: string;
    };
    reason?: string;
    request?: Request;
    orgId: string;
  }) {
    const log = this.repository.create({
      entityType,
      entityId,
      action,
      previousState,
      newState,
      performedBy,
      reason,
      ipAddress: request?.ip,
      timestamp: new Date(),
      orgId,
    });

    await this.repository.save(log);
  }

  static async getLogsByEntity(
    entityType: EntityType,
    entityId: number,
    orgId: string
  ) {
    return await this.repository.find({
      where: {
        entityType,
        entityId,
        orgId,
      },
      order: {
        timestamp: "DESC",
      },
    });
  }

  static async getLogsByUser(userId: string, orgId: string) {
    return await this.repository.find({
      where: {
        performedBy: {
          id: userId,
        },
        orgId,
      },
      order: {
        timestamp: "DESC",
      },
    });
  }

  static async getRecentLogs(orgId: string, limit: number = 100) {
    return await this.repository.find({
      where: {
        orgId,
      },
      order: {
        timestamp: "DESC",
      },
      take: limit,
    });
  }
}
