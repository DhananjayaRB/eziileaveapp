import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PTOVariant } from "./PTOVariant";
import { LeaveOrganisation } from "./LeaveOrganisation";

@Entity()
export class PTO {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  isEnabled: boolean;

  @Column({ default: 0 })
  variantCount: number;

  @OneToMany(() => PTOVariant, (variant) => variant.pto)
  variants: PTOVariant[];

  @OneToOne(() => LeaveOrganisation, (org) => org.pto)
  @JoinColumn()
  organisation: LeaveOrganisation;
}
