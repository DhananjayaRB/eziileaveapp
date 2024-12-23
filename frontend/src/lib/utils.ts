import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toCamelCase = (str: string) => {
  return str
    .replace(/-/g, "") // Remove hyphens
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase()
    )
    .replace(/\s+/g, "");
};

export const VALIDATION_TOASTS = {
  minimumLeaveUnit: "Minimum Leave Unit",
  variantName: "Variant Name",
  description: "Description",
  leavesGrantedBasedOn: "Leaves Granted Based On",
  paidDaysInAYear: "Paid Days In A Year",
  grantLeaves: "Grant Leaves",
  grantPer: "Grant Per",
  proRataCalculation: "Pro Rata Calculation",
  monthlySlabs: "Monthly Slabs",
  applicableFor: "Applicable For",
  applicableAfter: "Applicable After",
  mustBePlannedInAdvanceBy: "Must Be Planned In Advance By",
  maxDaysInAStretch: "Max Days In A Stretch",
  minDaysRequiredForALeave: "Min Days Required For A Leave",
  maxInstances: "Max Instances",
  leavesImmediatelyBeforeAndAfterAWeekend:
    "Leaves Immediately Before And After A Weekend",
  leavesImmediatelyBeforeAndAfterAHoliday:
    "Leaves Immediately Before And After A Holiday",
  clubbingWithOtherLeaveTypes: "Clubbing With Other Leave Types",
  supportingDocuments: "Supporting Documents",
  leavesDuringNoticePeriod: "Leaves During Notice Period",
  requiresReviewWorkflow: "Requires Review Workflow",
  deductBalanceBeforeWorkflow: "Deduct Balance Before Workflow",
  gracePeriodForApplying: "Grace Period For Applying",
  withdrawalOfApplicationAllowed: "Withdrawal Of Application Allowed",
  negativeLeaveBalanceAllowedUpTo: "Negative Leave Balance Allowed Up To",
  carryForwardLimit: "Carry Forward Limit",
  enCashment: "En Cashment",
  enCashmentCalculation: "En Cashment Calculation",
  maxDaysEnCashable: "Max Days En Cashable",
  enCashmentAt: "En Cashment At",
  allowApplicationsOnBehalfOfOthers: "Allow Applications On Behalf Of Others",
  showLeaveDataInPayslips: "Show Leave Data In Payslips",
  allowAsPlannedLeave: "Allow As Planned Leave",
};

export const COMPOFF_VALIDATION_TOASTS = {
  unitsAllowed: "Units Allowed",
  minimumHoursRequired: "Minimum Hours Required",
  variantName: "Variant Name",
  description: "Description",
  maxCompOffApplications: "Max Comp-off Applications",
  requiresReviewWorkflow: "Requires Review Workflow",
  approvalRequestsMadeBefore: "Approval Requests Made Before",
  availedWithin: "Availed Within",
  allowNonWorkingDays: "Allow Non Working Days",
  withdrawalOfApplicationAllowed: "Withdrawal Of Application Allowed",
  compOffsDuringNoticePeriod: "Comp-off During Notice Period",
  carryForwardEnabled: "Carry Forward Enabled",
  carryForwardLapseIn: "Carry Forward Lapse In",
  carryForwardToNextCycle: "Carry Forward To Next Cycle",
  compensationEnabled: "Compensation Enabled",
  maxDaysThatCanBeEncashed: "Max Days That Can Be Encashed",
  compensationOptions: "Compensation Options",
  assignedTo: "Assigned To",
};

export const PTO_VALIDATION_TOASTS = {
  unitsAllowed: "Units Allowed",
  variantName: "Variant Name",
  description: "Description",
  applicableAfter: "Applicable After",
  requiresReviewWorkflow: "Requires Review Workflow",
  approvalRequestsMadeBefore: "Approval Requests Made Before",
  minimumHoursRequired: "Minimum Hours Required",
  maxHoursAllowed: "Max Hours Allowed",
  maxInstances: "Max Instances",
  ptoDuringNoticePeriod: "PTO During Notice Period",
  supportingDocuments: "Supporting Documents",
  ptoCrossed: "PTO Crossed",
  ptoGranted: "PTO Granted",
  assignedTo: "Assigned To",
};
