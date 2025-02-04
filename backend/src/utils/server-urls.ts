export const RESOLVE_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiIxIiwidXNlcl9pZCI6IjEiLCJyb2xlX2lkIjoiMSIsInVzZXJfdHlwZV9pZCI6IiIsIm5iZiI6MTczODY1MzgzMiwiZXhwIjoxNzM5MjUzODMyLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo1MDAzIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMyJ9.VMNj2-vNzlHK0VqjBjND-E6J53obffp78nDKBD5Qlh4";

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
