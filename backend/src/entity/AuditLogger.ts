import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

export enum EntityType {
  ROLE = "ROLE",
  WORKFLOW = "WORKFLOW",
  LEAVE_TYPE = "LEAVE_TYPE",
  LEAVE_VARIANT = "LEAVE_VARIANT",
  PTO = "PTO",
  PTO_VARIANT = "PTO_VARIANT",
  COMP_OFF = "COMP_OFF",
  COMP_OFF_VARIANT = "COMP_OFF_VARIANT",
  ORGANISATION = "ORGANISATION",
  APPLICATION = "APPLICATION",
}

export enum ActionType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  ENABLE = "ENABLE",
  DISABLE = "DISABLE",
}

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: true })
  orgId: string;

  @Column({
    type: "enum",
    enum: EntityType,
  })
  entityType: EntityType;

  @Column()
  entityId: number;

  @Column({
    type: "enum",
    enum: ActionType,
  })
  action: ActionType;

  @Column("jsonb", { nullable: true })
  previousState: object;

  @Column("jsonb", { nullable: true })
  newState: object;

  @Column("jsonb")
  performedBy: {
    id: string;
    name: string;
  };

  @Column({ type: "text", nullable: true })
  reason?: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  timestamp: Date;

  @Column({ type: "inet", nullable: true })
  ipAddress?: string;
}
