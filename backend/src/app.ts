import { json } from "body-parser";
import express from "express";
import "express-async-errors";
import cors from "cors";
import { newLeaveTypeRouter } from "./routes/admin/leaves/new";
import { patchLeaveTypeRouter } from "./routes/admin/leaves/patch";
import { getLeaveTypesRouter } from "./routes/admin/leaves/get";
import { seedRouter } from "./routes/util/seed";
import { pruneRouter } from "./routes/util/prune";
import { newLeaveVariantRouter } from "./routes/admin/leave-variant/new";
import { getLeaveVariantByLeaveTypeRouter } from "./routes/admin/leave-variant/get-by-leave";
import { getLeaveVariantByIdRouter } from "./routes/admin/leave-variant/get-by-id";
import { patchLeaveVariantRouter } from "./routes/admin/leave-variant/patch";
import { deleteLeaveVariantRouter } from "./routes/admin/leave-variant/delete";
import { patchCompOffRouter } from "./routes/admin/comp-off/patch";
import { getCompOffRouter } from "./routes/admin/comp-off/get";
import { newCompOffRouter } from "./routes/admin/comp-off/new";
import { newCompOffVariantRouter } from "./routes/admin/comp-off-variant/new";
import { getCompOffVariantRouter } from "./routes/admin/comp-off-variant/get";
import { patchCompOffVariantRouter } from "./routes/admin/comp-off-variant/patch";
import { deleteCompOffVariantRouter } from "./routes/admin/comp-off-variant/delete";
import { newPtoRouter } from "./routes/admin/pto/new";
import { getPtoRouter } from "./routes/admin/pto/get";
import { patchPtoRouter } from "./routes/admin/pto/patch";
import { newPTOVariantRouter } from "./routes/admin/pto-variant/new";
import { patchPTOVariantRouter } from "./routes/admin/pto-variant/patch";
import { deletePTOVariantRouter } from "./routes/admin/pto-variant/delete";
import { getPTOVariantRouter } from "./routes/admin/pto-variant/get";
import { deleteRoleRouter } from "./routes/admin/roles/delete";
import { getRoleByIdRouter } from "./routes/admin/roles/get-by-id";
import { getRoleRouter } from "./routes/admin/roles/get";
import { newRoleRouter } from "./routes/admin/roles/new";
import { putRoleRouter } from "./routes/admin/roles/put";
import { deleteWorkflowRouter } from "./routes/admin/workflow/delete";
import { getWorkflowByIdRouter } from "./routes/admin/workflow/get-by-id";
import { getWorkflowRouter } from "./routes/admin/workflow/get";
import { newWorkflowRouter } from "./routes/admin/workflow/new";
import { putWorkflowRouter } from "./routes/admin/workflow/put";
import { getLogsRouter } from "./routes/logger/get";
import { newOrganisationRouter } from "./routes/admin/organisation/new";
import { getOrganisationByIdRouter } from "./routes/admin/organisation/get-by-id";
import { getOrganisationRouter } from "./routes/admin/organisation/get";
import { patchOrganisationRouter } from "./routes/admin/organisation/patch";
import { deleteOrganisationRouter } from "./routes/admin/organisation/delete";
import { getCompOffVariantByIdRouter } from "./routes/admin/comp-off-variant/get-by-id";
import { getPTOVariantByIdRouter } from "./routes/admin/pto-variant/get-by-id";
import { getEmployeeLeavesRouter } from "./routes/employees/leaves/get";
import { getEmployeeLeaveDetailsRouter } from "./routes/employees/details/get";
import { newLeaveApplicationRouter } from "./routes/employees/apply-leave/new";
import { getLeaveApplicationsRouter } from "./routes/employees/apply-leave/get";
import { deleteLeaveApplicationRouter } from "./routes/employees/apply-leave/delete";
import { getWorkflowApplicationsRouter } from "./routes/admin/workflow/applications/get";
import { approveWorkflowApplicationRouter } from "./routes/admin/workflow/applications/post";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(cors({ origin: "*", credentials: true }));

// util routes
app.use(seedRouter);
app.use(pruneRouter);
app.use(getLogsRouter);

// admin routes
// organisation routes
app.use(newOrganisationRouter);
app.use(getOrganisationByIdRouter);
app.use(getOrganisationRouter);
app.use(patchOrganisationRouter);
app.use(deleteOrganisationRouter);

// leave type routes
app.use(newLeaveTypeRouter);
app.use(patchLeaveTypeRouter);
app.use(getLeaveTypesRouter);

// leave variant routes
app.use(newLeaveVariantRouter);
app.use(getLeaveVariantByLeaveTypeRouter);
app.use(getLeaveVariantByIdRouter);
app.use(patchLeaveVariantRouter);
app.use(deleteLeaveVariantRouter);

// comp off routes
app.use(newCompOffRouter);
app.use(getCompOffRouter);
app.use(patchCompOffRouter);

// comp off variant routes
app.use(newCompOffVariantRouter);
app.use(getCompOffVariantRouter);
app.use(patchCompOffVariantRouter);
app.use(deleteCompOffVariantRouter);
app.use(getCompOffVariantByIdRouter);

// pto routes
app.use(newPtoRouter);
app.use(getPtoRouter);
app.use(patchPtoRouter);

// pto variant routes
app.use(newPTOVariantRouter);
app.use(patchPTOVariantRouter);
app.use(deletePTOVariantRouter);
app.use(getPTOVariantRouter);
app.use(getPTOVariantByIdRouter);

// roles
app.use(deleteRoleRouter);
app.use(getRoleByIdRouter);
app.use(getRoleRouter);
app.use(newRoleRouter);
app.use(putRoleRouter);

// workflow
app.use(deleteWorkflowRouter);
app.use(getWorkflowByIdRouter);
app.use(getWorkflowRouter);
app.use(newWorkflowRouter);
app.use(putWorkflowRouter);

// workflow applications
app.use(getWorkflowApplicationsRouter);
app.use(approveWorkflowApplicationRouter);

// employee routes
// leaves
app.use(getEmployeeLeavesRouter);
app.use(getEmployeeLeaveDetailsRouter);

// apply
app.use(newLeaveApplicationRouter);
app.use(getLeaveApplicationsRouter);
app.use(deleteLeaveApplicationRouter);

export { app };
