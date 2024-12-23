import { json } from "body-parser";
import express from "express";
import "express-async-errors";
import cors from "cors";
import { newLeaveTypeRouter } from "./routes/leaves/new";
import { patchLeaveTypeRouter } from "./routes/leaves/patch";
import { getLeaveTypesRouter } from "./routes/leaves/get";
import { seedRouter } from "./routes/util/seed";
import { pruneRouter } from "./routes/util/prune";
import { newLeaveVariantRouter } from "./routes/leave-variant/new";
import { getLeaveVariantByLeaveTypeRouter } from "./routes/leave-variant/get-by-leave";
import { getLeaveVariantByIdRouter } from "./routes/leave-variant/get-by-id";
import { patchLeaveVariantRouter } from "./routes/leave-variant/patch";
import { deleteLeaveVariantRouter } from "./routes/leave-variant/delete";
import { patchCompOffRouter } from "./routes/comp-off/patch";
import { getCompOffRouter } from "./routes/comp-off/get";
import { newCompOffRouter } from "./routes/comp-off/new";
import { newCompOffVariantRouter } from "./routes/comp-off-variant/new";
import { getCompOffVariantRouter } from "./routes/comp-off-variant/get";
import { patchCompOffVariantRouter } from "./routes/comp-off-variant/patch";
import { deleteCompOffVariantRouter } from "./routes/comp-off-variant/delete";
import { newPtoRouter } from "./routes/pto/new";
import { getPtoRouter } from "./routes/pto/get";
import { patchPtoRouter } from "./routes/pto/patch";
import { newPTOVariantRouter } from "./routes/pto-variant/new";
import { patchPTOVariantRouter } from "./routes/pto-variant/patch";
import { deletePTOVariantRouter } from "./routes/pto-variant/delete";
import { getPTOVariantRouter } from "./routes/pto-variant/get";
import { deleteRoleRouter } from "./routes/roles/delete";
import { getRoleByIdRouter } from "./routes/roles/get-by-id";
import { getRoleRouter } from "./routes/roles/get";
import { newRoleRouter } from "./routes/roles/new";
import { putRoleRouter } from "./routes/roles/put";
import { deleteWorkflowRouter } from "./routes/workflow/delete";
import { getWorkflowByIdRouter } from "./routes/workflow/get-by-id";
import { getWorkflowRouter } from "./routes/workflow/get";
import { newWorkflowRouter } from "./routes/workflow/new";
import { putWorkflowRouter } from "./routes/workflow/put";
import { getLogsRouter } from "./routes/logger/get";
import { newOrganisationRouter } from "./routes/organisation/new";
import { getOrganisationByIdRouter } from "./routes/organisation/get-by-id";
import { getOrganisationRouter } from "./routes/organisation/get";
import { patchOrganisationRouter } from "./routes/organisation/patch";
import { deleteOrganisationRouter } from "./routes/organisation/delete";
import { getCompOffVariantByIdRouter } from "./routes/comp-off-variant/get-by-id";
import { getPTOVariantByIdRouter } from "./routes/pto-variant/get-by-id";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(cors({ origin: "*", credentials: true }));

// util routes
app.use(seedRouter);
app.use(pruneRouter);
app.use(getLogsRouter);

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

export { app };
