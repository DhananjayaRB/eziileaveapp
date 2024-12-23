import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { CompOffVariant } from "./CompOffVariant";
import { LeaveOrganisation } from "./LeaveOrganisation";

@Entity()
export class CompOff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  isEnabled: boolean;

  @Column({ default: 0 })
  variantCount: number;

  @OneToMany(() => CompOffVariant, (variant) => variant.compOff)
  variants: CompOffVariant[];

  @OneToOne(() => LeaveOrganisation, (org) => org.compOff)
  @JoinColumn()
  organisation: LeaveOrganisation;
}
