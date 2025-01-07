import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { LeaveType } from "./LeaveType";
import {
  AssignedTo,
  CarryForwardLimit,
  LeaveVariantSlab,
  MaxInstances,
  SupportingDocuments,
} from "../utils/types";
import { LeaveOrganisation } from "./LeaveOrganisation";

@Entity()
export class LeaveVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { array: true })
  minimumLeaveUnit: string[];

  @Column()
  variantName: string;

  @Column()
  description: string;

  @Column()
  leavesGrantedBasedOn: string;

  @Column()
  paidDaysInAYear: number;

  @Column()
  grantLeaves: string;

  @Column()
  grantPer: string;

  @Column()
  proRataCalculation: string;

  @Column("jsonb")
  monthlySlabs: LeaveVariantSlab[];

  @Column("text", { array: true })
  applicableFor: string[];

  @Column()
  applicableAfter: string;

  @Column()
  mustBePlannedInAdvanceBy: string;

  @Column()
  maxDaysInAStretch: number;

  @Column()
  minDaysRequiredForALeave: number;

  @Column("jsonb")
  maxInstances: MaxInstances;

  @Column()
  leavesImmediatelyBeforeAndAfterAWeekend: string;

  @Column()
  leavesImmediatelyBeforeAndAfterAHoliday: string;

  @Column()
  clubbingWithOtherLeaveTypes: string;

  @Column("jsonb")
  supportingDocuments: SupportingDocuments;

  @Column()
  leavesDuringNoticePeriod: string;

  @Column()
  requiresReviewWorkflow: string;

  @Column("text", { nullable: true })
  deductBalanceBeforeWorkflow: string;

  @Column()
  gracePeriodForApplying: string;

  @Column({ nullable: true })
  withdrawalOfApplicationAllowed: string;

  @Column()
  negativeLeaveBalanceAllowedUpTo: string;

  @Column("jsonb")
  carryForwardLimit: CarryForwardLimit;

  @Column()
  enCashment: boolean;

  @Column("text", { array: true })
  enCashmentCalculation: string[];

  @Column()
  maxDaysEnCashable: string;

  @Column()
  enCashmentAt: string;

  @Column()
  allowApplicationsOnBehalfOfOthers: string;

  @Column("text", { array: true })
  showLeaveDataInPayslips: string[];

  @Column()
  allowAsPlannedLeave: string;

  @Column("jsonb", { nullable: true })
  assignedTo: AssignedTo[];

  @ManyToOne(() => LeaveType, (leaveType) => leaveType.variants, {
    onDelete: "CASCADE",
  })
  leaveType: LeaveType;

  @ManyToOne(() => LeaveOrganisation, (org) => org.leaveVariants)
  organisation: LeaveOrganisation;
}
