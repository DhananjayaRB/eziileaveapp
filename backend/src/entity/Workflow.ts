import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CreatedBy, WorkflowStep } from "../utils/types";
import { LeaveOrganisation } from "./LeaveOrganisation";

@Entity()
export class Workflow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  effectiveDate: string;

  @Column()
  process: string;

  @Column()
  subProcess: string;

  @Column("jsonb")
  createdBy: CreatedBy;

  @Column({ nullable: true })
  createdAt: string;

  @Column()
  employeesInvolved: number;

  @Column("jsonb")
  steps: WorkflowStep[];

  @ManyToOne(() => LeaveOrganisation, (org) => org.workflows)
  organisation: LeaveOrganisation;
}
