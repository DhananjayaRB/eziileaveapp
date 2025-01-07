import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { LeaveVariant } from "./LeaveVariant";
import { LeaveOrganisation } from "./LeaveOrganisation";

@Entity()
export class LeaveType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  isEnabled: boolean;

  @Column({ default: 0 })
  variantCount: number;

  @OneToMany(() => LeaveVariant, (variant) => variant.leaveType)
  variants: LeaveVariant[]; // Relationship with variants

  @ManyToOne(() => LeaveOrganisation, (org) => org.leaveTypes)
  organisation: LeaveOrganisation;
}
