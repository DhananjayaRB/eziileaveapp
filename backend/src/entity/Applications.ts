import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LeaveOrganisation } from "./LeaveOrganisation";
import {
  AssignTasks,
  EndDate,
  onBehalfOf,
  StartDate,
  WorkflowStep,
} from "../utils/types";
import { Workflow } from "./Workflow";

export enum ApplicationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

@Entity()
export class Applications {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  applicationType: string;

  @Column({
    type: "enum",
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column("text", { nullable: true })
  message: string;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column("jsonb", { nullable: true })
  supportingDocuments: string[];

  @Column("jsonb", { nullable: true })
  assignTasks: AssignTasks[];

  @Column("jsonb", { nullable: true })
  behalfOfSomeoneElse: onBehalfOf;

  @Column()
  description: string;

  @Column("jsonb", { nullable: true })
  startDate: StartDate;

  @Column("jsonb", { nullable: true })
  endDate: EndDate;

  @Column()
  leaveType: string;

  @Column()
  reasonForLeave: string;

  @ManyToOne(() => Workflow, { nullable: true })
  workflow: Workflow;

  @Column("jsonb", { nullable: true })
  currentStep: WorkflowStep;

  @ManyToOne(() => LeaveOrganisation, (org) => org.applications)
  organisation: LeaveOrganisation;
}
