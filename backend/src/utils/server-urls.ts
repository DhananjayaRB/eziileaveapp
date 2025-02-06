export const RESOLVE_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiI2MyIsInVzZXJfaWQiOiIxIiwicm9sZV9pZCI6IjI4OSIsInVzZXJfdHlwZV9pZCI6IjMiLCJuYmYiOjE3Mzg3MzIyNjgsImV4cCI6MTc0MDk2MDAwMCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMyIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjUwMDMifQ.9Cjzcc6Ks72-Fqu1K9fykUMu_Y-GycmzMt4VJoWZk3k";

export const RESOLVE_EMPLOYEE_API =
  "https://uat-api.resolveindia.com/reports/worker-master-filter";

export const RESOLVE_EMPLOYEE_API_BODY = {
  userBlocks: [1, 3, 4],
  userWise: 0,
  workerType: 0,
  attribute: 0,
  subAttributeId: 0,
};

export const RESOLVE_MAPPING = {
  division: "Division",
  department: "Department",
  designation: "Designation",
  customer: "Customer",
  process: "Process",
  subProcess: "Sub-Process",
  subLocation: "Sub Location",
  orgState: "Org State",
  contractType: "Contract Type",
  sector: "Sector",
  location: "Location",
  costCenter: "Cost Center",
  level: "Level",
  vendor: "Vendor",
};
