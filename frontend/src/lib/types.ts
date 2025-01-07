export interface LeaveType {
  id: number;
  name: string;
  isEnabled: boolean;
  variantCount: number;
}

interface LeaveVariantSlab {
  earn: string;
  days: string;
}

export interface LeaveVariant {
  id?: number;
  minimumLeaveUnit: string[];
  variantName: string;
  description: string;
  leavesGrantedBasedOn: string;
  paidDaysInAYear: string;
  grantLeaves: string;
  grantPer: string;
  proRataCalculation: string;
  monthlySlabs: LeaveVariantSlab[];
  applicableFor: string[];
  applicableAfter: string;
  mustBePlannedInAdvanceBy: string;
  maxDaysInAStretch: string;
  minDaysRequiredForALeave: string;
  maxInstances: { days: string; duration: string };
  leavesImmediatelyBeforeAndAfterAWeekend: string;
  leavesImmediatelyBeforeAndAfterAHoliday: string;
  clubbingWithOtherLeaveTypes: string;
  supportingDocuments: {
    status: string;
    description: string;
  };
  leavesDuringNoticePeriod: string;
  requiresReviewWorkflow: string;
  deductBalanceBeforeWorkflow: string;
  gracePeriodForApplying: string;
  withdrawalOfApplicationAllowed: string;
  negativeLeaveBalanceAllowedUpTo: string;
  carryForwardLimit: {
    duration: string;
    limit: string;
  };
  enCashment: boolean;
  enCashmentCalculation: string[];
  maxDaysEnCashable: string;
  enCashmentAt: string;
  allowApplicationsOnBehalfOfOthers: string;
  showLeaveDataInPayslips: string[];
  allowAsPlannedLeave: string;
  assignedTo: AssignedTo[];
}

export interface CompOff {
  id?: number;
  isEnabled: boolean;
  variantCount: number;
}

export interface PTO {
  id?: number;
  isEnabled: boolean;
  variantCount: number;
}

interface CompensationOption {
  option: string;
  subOptions: string[];
}

export interface CompOffVariant {
  id?: number;
  unitsAllowed: { unit: string; duration: string }[];
  minimumHoursRequired: string;
  variantName: string;
  description: string;
  maxCompOffApplications: {
    duration: string;
    count: string;
  };
  requiresReviewWorkflow: boolean;
  approvalRequestsMadeBefore: string;
  availedWithin: string;
  allowNonWorkingDays: boolean;
  withdrawalOfApplicationAllowed: string;
  compOffsDuringNoticePeriod: boolean;
  carryForwardEnabled: boolean;
  carryForwardLapseIn: {
    duration: string;
    limit: string;
  };
  carryForwardToNextCycle: string;
  compensationEnabled: boolean;
  maxDaysThatCanBeEncashed: {
    days: string;
    hours: string;
  };
  compensationOptions: CompensationOption[];
  assignedTo: AssignedTo[];
  compOff?: {
    id: number;
    name: string;
    isEnabled: boolean;
    variantCount: number;
  };
}

export interface PTOVariant {
  id?: number;
  unitsAllowed: string[];
  variantName: string;
  description: string;
  applicableAfter: {
    days: string;
    duration: string;
  };
  requiresReviewWorkflow: boolean;
  approvalRequestsMadeBefore: string;
  minimumHoursRequired: string;
  maxHoursAllowed: string;
  maxInstances: {
    days: string;
    duration: string;
  };
  ptoDuringNoticePeriod: boolean;
  supportingDocuments: {
    status: string;
    description: string;
  };
  ptoCrossed: {
    option: string;
    subOptions: string[];
  };
  ptoGranted: string;
  assignedTo: AssignedTo[];
  pto?: {
    id: number;
    name: string;
    isEnabled: boolean;
    variantCount: number;
  };
}

export interface RoleDataUnit {
  name: string;
  noOfEmployees: number;
}

export interface RoleData {
  locations: RoleDataUnit[];
  divisions: RoleDataUnit[];
  functions: RoleDataUnit[];
  designations: RoleDataUnit[];
}

export interface Permission {
  view: boolean;
  modify: boolean;
}

export interface Role {
  id?: number;
  roleName: string;
  assignedTo: AssignedTo[];
  createdBy?: {
    name: string;
  };
  permissions: {
    "Leave Approval": Permission;
    Workflows: Permission;
    "Leave Types": Permission;
    "Leave Configurations": Permission;
    "PTO Configurations": Permission;
    "Comp-Off Configurations": Permission;
  };
  allowOnBehalfOfOthers: {
    Leave: boolean;
    "Comp-Off": boolean;
    PTO: boolean;
  };
}

export interface ApplyTo {
  [key: string]: string[];
}

interface WorkflowStep {
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

export interface Workflow {
  id?: number;
  name: string;
  effectiveDate: string | null;
  process: string;
  subProcess: string;
  steps: WorkflowStep[];
  createdBy?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  employeesInvolved?: number;
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

export interface LeaveVariantResponse {
  leaveType: LeaveType;
  variants: LeaveVariant[];
}

export interface AssignedTo {
  employee_number: string;
  name: string;
}

export interface AssignTask {
  person: {
    user_name: string;
    employee_number: string;
  };
  task: string;
}

export interface LeaveForm {
  leaveType: string;
  startDate: {
    date: string | null;
    halfDay?: boolean;
    whichHalf?: string;
  };
  endDate: {
    date: string | null;
    halfDay?: boolean;
    whichHalf?: string;
  };
  behalfOfSomeoneElse: {
    isSelected?: boolean;
    employee?: Employee;
  };
  reasonForLeave: string;
  description: string;
  supportingDocuments: string[];
  assignTasks: AssignTask[];
}

export interface CompOffForm {
  leaveType: string;
  date: string;
  fromTime: string;
  toTime: string;
  reasonForCompOff: string;
}

export interface PtoForm {
  // leaveType: string;
  date: string;
  fromTime: string;
  toTime: string;
  description: string;
  document:Array<File>;
}