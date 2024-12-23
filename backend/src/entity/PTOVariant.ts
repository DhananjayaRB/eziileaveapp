import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PTO } from "./PTO";
import {
  ApplicableAfter,
  AssignedTo,
  MaxInstances,
  PTOCrossed,
  SupportingDocuments,
} from "../utils/types";
import { LeaveOrganisation } from "./LeaveOrganisation";

@Entity()
export class PTOVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { array: true })
  unitsAllowed: string[];

  @Column()
  variantName: string;

  @Column()
  description: string;

  @Column("jsonb")
  applicableAfter: ApplicableAfter;

  @Column()
  requiresReviewWorkflow: boolean;

  @Column()
  approvalRequestsMadeBefore: string;

  @Column()
  minimumHoursRequired: string;

  @Column()
  maxHoursAllowed: string;

  @Column("jsonb")
  maxInstances: MaxInstances;

  @Column()
  ptoDuringNoticePeriod: boolean;

  @Column("jsonb")
  supportingDocuments: SupportingDocuments;

  @Column("jsonb")
  ptoCrossed: PTOCrossed;

  @Column()
  ptoGranted: string;

  @Column("jsonb", { nullable: true })
  assignedTo: AssignedTo[];

  @ManyToOne(() => PTO, (pto) => pto.variants, {
    onDelete: "CASCADE",
  })
  pto: PTO;

  @ManyToOne(() => LeaveOrganisation, (org) => org.ptoVariants)
  organisation: LeaveOrganisation;
}
