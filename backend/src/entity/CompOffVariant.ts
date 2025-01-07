import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { CompOff } from "./CompOff";
import {
  AssignedTo,
  CarryForwardLapseIn,
  CompensationOption,
  MaxCompOffApplications,
  MaxDaysThatCanBeEncashed,
  UnitsAllowed,
} from "../utils/types";
import { LeaveOrganisation } from "./LeaveOrganisation";

@Entity()
export class CompOffVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  allowNonWorkingDays: boolean;

  @Column()
  approvalRequestsMadeBefore: string;

  @Column("jsonb", { nullable: true })
  assignedTo: AssignedTo[];

  @Column()
  availedWithin: string;

  @Column()
  carryForwardEnabled: boolean;

  @Column("jsonb")
  carryForwardLapseIn: CarryForwardLapseIn;

  @Column()
  carryForwardToNextCycle: string;

  @Column()
  compOffsDuringNoticePeriod: boolean;

  @Column()
  compensationEnabled: boolean;

  @Column("jsonb")
  compensationOptions: CompensationOption[];

  @Column()
  description: string;

  @Column("jsonb")
  maxCompOffApplications: MaxCompOffApplications;

  @Column("jsonb")
  maxDaysThatCanBeEncashed: MaxDaysThatCanBeEncashed;

  @Column()
  minimumHoursRequired: string;

  @Column()
  requiresReviewWorkflow: boolean;

  @Column("jsonb")
  unitsAllowed: UnitsAllowed[];

  @Column()
  variantName: string;

  @Column({ nullable: true })
  withdrawalOfApplicationAllowed: string;

  @ManyToOne(() => CompOff, (compOff) => compOff.variants, {
    onDelete: "CASCADE",
  })
  compOff: CompOff;

  @ManyToOne(() => LeaveOrganisation, (org) => org.compOffVariants)
  organisation: LeaveOrganisation;
}
