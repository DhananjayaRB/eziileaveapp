import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
} from "typeorm";
import { CreatedBy } from "../utils/types";
import { LeaveType } from "./LeaveType";
import { LeaveVariant } from "./LeaveVariant";
import { CompOffVariant } from "./CompOffVariant";
import { PTOVariant } from "./PTOVariant";
import { Role } from "./Roles";
import { Workflow } from "./Workflow";
import { PTO } from "./PTO";
import { CompOff } from "./CompOff";

@Entity()
export class LeaveOrganisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("jsonb")
  createdBy: CreatedBy;

  @Column()
  orgId: string;

  @Column("text", { nullable: true })
  effectiveDate: string;

  @Column("numeric", { nullable: true })
  setupPercentage: number;

  @OneToMany(() => LeaveType, (leaveType) => leaveType.organisation)
  leaveTypes: LeaveType[];

  @OneToMany(() => LeaveVariant, (leaveVariant) => leaveVariant.organisation)
  leaveVariants: LeaveVariant[];

  @OneToMany(
    () => CompOffVariant,
    (compOffVariant) => compOffVariant.organisation
  )
  compOffVariants: CompOffVariant[];

  @OneToMany(() => PTOVariant, (ptoVariant) => ptoVariant.organisation)
  ptoVariants: PTOVariant[];

  @OneToMany(() => Role, (role) => role.organisation)
  roles: Role[];

  @OneToMany(() => Workflow, (workflow) => workflow.organisation)
  workflows: Workflow[];

  @OneToOne(() => PTO, (pto) => pto.organisation)
  pto: PTO;

  @OneToOne(() => CompOff, (compOff) => compOff.organisation)
  compOff: CompOff;
}
