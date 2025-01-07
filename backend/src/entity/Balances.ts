import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LeaveOrganisation } from "./LeaveOrganisation";

@Entity()
export class Balances {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employee_number: string;

  @Column("jsonb")
  leaveBalances: {
    [leaveTypeId: number]: {
      total: number;
      used: number;
      pending: number;
      //   carryForward: number;
    };
  };

  @Column("jsonb")
  compOffBalances: {
    [variantId: number]: {
      total: number;
      used: number;
      pending: number;
      //   carryForward: number;
    };
  };

  @Column("jsonb")
  ptoBalances: {
    [variantId: number]: {
      total: number;
      used: number;
      pending: number;
    };
  };

  @ManyToOne(() => LeaveOrganisation, (org) => org.balances)
  organisation: LeaveOrganisation;
}
