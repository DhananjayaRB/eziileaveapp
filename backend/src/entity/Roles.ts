import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import {
  AllowOnBehalfOfOthers,
  AssignedTo,
  CreatedBy,
  Permission,
} from "../utils/types";
import { LeaveOrganisation } from "./LeaveOrganisation";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleName: string;

  @Column("jsonb", { nullable: true })
  assignedTo: AssignedTo[];

  @Column("jsonb")
  createdBy: CreatedBy;

  @Column("jsonb")
  leaveApproval: Permission;

  @Column("jsonb")
  workflows: Permission;

  @Column("jsonb")
  leaveTypes: Permission;

  @Column("jsonb")
  leaveConfigurations: Permission;

  @Column("jsonb")
  ptoConfigurations: Permission;

  @Column("jsonb")
  compOffConfigurations: Permission;

  @Column("jsonb")
  allowOnBehalfOfOthers: AllowOnBehalfOfOthers;

  @Column("text", { array: true, nullable: true })
  sector: string[];

  @Column("text", { array: true, nullable: true })
  subLocation: string[];

  @Column("text", { array: true, nullable: true })
  orgState: string[];

  @Column("text", { array: true, nullable: true })
  costCenter: string[];

  @Column("text", { array: true, nullable: true })
  subDepartment: string[];

  @Column("text", { array: true, nullable: true })
  businessUnit: string[];

  @Column("text", { array: true, nullable: true })
  lineOfBusiness: string[];

  @Column("text", { array: true, nullable: true })
  department: string[];

  @Column("text", { array: true, nullable: true })
  project: string[];

  @Column("text", { array: true, nullable: true })
  customer: string[];

  @Column("text", { array: true, nullable: true })
  workStream: string[];

  @Column("text", { array: true, nullable: true })
  activities: string[];

  @Column("text", { array: true, nullable: true })
  programme: string[];

  @Column("text", { array: true, nullable: true })
  process: string[];

  @Column("text", { array: true, nullable: true })
  subProcess: string[];

  @Column("text", { array: true, nullable: true })
  level: string[];

  @Column("text", { array: true, nullable: true })
  location: string[];

  @Column("text", { array: true, nullable: true })
  division: string[];

  @Column("text", { array: true, nullable: true })
  function: string[];

  @Column("text", { array: true, nullable: true })
  designation: string[];

  @ManyToOne(() => LeaveOrganisation, (org) => org.roles)
  organisation: LeaveOrganisation;
}
