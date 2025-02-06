import "reflect-metadata";
import { DataSource } from "typeorm";
import { LeaveType } from "./entity/LeaveType";
import { LeaveVariant } from "./entity/LeaveVariant";
import { CompOffVariant } from "./entity/CompOffVariant";
import { CompOff } from "./entity/CompOff";
import { PTO } from "./entity/PTO";
import { PTOVariant } from "./entity/PTOVariant";
import { Role } from "./entity/Roles";
import { Workflow } from "./entity/Workflow";
import { AuditLog } from "./entity/AuditLogger";
import { LeaveOrganisation } from "./entity/LeaveOrganisation";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "20.204.119.48",
  port: 5432,
  username: "postgres",
  password: "resolve@2022",
  database: "resolve-leave",
  synchronize: true,
  logging: false,
  entities: [
    LeaveOrganisation,
    LeaveType,
    LeaveVariant,
    CompOff,
    CompOffVariant,
    PTO,
    PTOVariant,
    Role,
    Workflow,
    AuditLog,
  ],
  migrations: [],
  subscribers: [],
});
