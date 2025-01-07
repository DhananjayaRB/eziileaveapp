export interface LeaveVariantSlab {
  earn: string;
  days: string;
}

export interface MaxInstances {
  days: string;
  duration: string;
}

export interface SupportingDocuments {
  status: string;
  description: string;
}

export interface CarryForwardLimit {
  duration: string;
  limit: string;
}

export interface CompensationOption {
  option: string;
  subOptions: string[];
}

export interface UnitsAllowed {
  unit: string;
  duration: string;
}

export interface CarryForwardLapseIn {
  duration: string;
  limit: string;
}

export interface MaxCompOffApplications {
  duration: string;
  count: string;
}

export interface MaxDaysThatCanBeEncashed {
  days: string;
  hours: string;
}

export interface ApplicableAfter {
  days: string;
  duration: string;
}

export interface PTOCrossed {
  option: string;
  subOptions: string[];
}

export interface Permission {
  view: boolean;
  modify: boolean;
}

export interface AllowOnBehalfOfOthers {
  Leave: boolean;
  "Comp-Off": boolean;
  PTO: boolean;
}

export interface CreatedBy {
  id: string;
  name?: string;
}

export interface AssignedTo {
  employee_number: string;
  name: string;
}

export interface WorkflowStep {
  id: number;
  name: string;
  forwardToNext: boolean;
  forwardAfter: {
    days: string;
    hours: string;
  };
  assignedRoles: { id: number; name: string }[];
  autoApproval?: boolean;
}

export interface Employee {
  Mobile_number_1: string;
  Mobile_number_2: string;
  band_name: string;
  communication_email: string;
  date_of_birth: string;
  date_of_joining: string;
  last_working_day?: string;
  designation_name: string;
  email: string;
  employee_number: string;
  first_name: string;
  gender_name: string;
  is_differently_abled: string;
  last_name: string;
  middle_name: string;
  type_id_0: string | null; //Location
  type_id_1: string | null; //Department
  type_id_2: string | null; //Designation
  type_id_8: string | null; // Customer
  type_id_9: string | null; // Process
  type_id_11: string | null; // Sub-Process
  type_id_16: string | null; // Sub Location
  type_id_18: string | null; // Org State
  worker_type: string | null; // Contract Type
  user_name: string;
  user_profile: string;
  user_role_name: string;
  vendor_name: string;
  level_name: string;
  reporting_manager_id: string;
}

export interface EmployeeAPIResponse {
  result: string;
  statuscode: number;
  message: string;
  data: {
    data: Employee[];
  };
}

export interface AssignTasks {
  person: Employee;
  task: string;
}

export interface onBehalfOf {
  isSelected: boolean;
  employee: Employee;
}

export interface StartDate {
  date: string;
  halfDay?: boolean;
  whichHalf?: string;
}

export interface EndDate {
  date: string;
  halfDay?: boolean;
  whichHalf?: string;
}
