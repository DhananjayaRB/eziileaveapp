import Joi from "joi";

export const LeaveVariantSchema = Joi.object({
  id: Joi.number(),
  variantName: Joi.string().required().messages({
    "any.required": "Variant name is required",
  }),
  leaveType: Joi.object({
    id: Joi.number().required(),
    name: Joi.string(),
    isEnabled: Joi.boolean(),
    variantCount: Joi.number(),
  }).allow(null),
  organisation: Joi.object({
    id: Joi.number().required(),
    orgId: Joi.string(),
    setupPercentage: Joi.number(),
  }).allow(null),
  description: Joi.string().required().messages({
    "any.required": "Description is required",
  }),
  minimumLeaveUnit: Joi.array().messages({
    "array.base": "Minimum leave unit must be an array",
  }),
  leavesGrantedBasedOn: Joi.any(),
  paidDaysInAYear: Joi.number().messages({
    "number.base": "Paid days in a year must be a number",
  }),
  grantLeaves: Joi.any(),
  grantPer: Joi.any(),
  proRataCalculation: Joi.any(),
  monthlySlabs: Joi.array(),
  applicableFor: Joi.array().messages({
    "array.base": "Applicable for must be an array",
  }),
  applicableAfter: Joi.string().messages({
    "number.base": "Applicable after must be a number",
  }),
  mustBePlannedInAdvanceBy: Joi.string().messages({
    "string.base": "Must be planned in advance by must be a string",
  }),
  maxDaysInAStretch: Joi.number().messages({
    "string.base": "Max days in a stretch must be a string",
  }),
  minDaysRequiredForALeave: Joi.number().messages({
    "string.base": "Min days required for a leave must be a string",
  }),
  maxInstances: Joi.object({
    days: Joi.string().messages({
      "string.base": "Max instances days must be a string",
    }),
    duration: Joi.any(),
  }).messages({
    "object.base": "Max instances must be an object",
  }),
  leavesImmediatelyBeforeAndAfterAWeekend: Joi.any(),
  leavesImmediatelyBeforeAndAfterAHoliday: Joi.any(),
  clubbingWithOtherLeaveTypes: Joi.any(),
  supportingDocuments: Joi.object({
    status: Joi.any(),
    description: Joi.string().messages({
      "string.base": "Supporting documents description must be a string",
    }),
  }).messages({
    "object.base": "Supporting documents must be an object",
  }),
  leavesDuringNoticePeriod: Joi.any(),
  requiresReviewWorkflow: Joi.any(),
  deductBalanceBeforeWorkflow: Joi.string(),
  gracePeriodForApplying: Joi.string().messages({
    "string.base": "Grace period for applying must be a string",
  }),
  withdrawalOfApplicationAllowed: Joi.string().messages({
    "string.base": "Withdrawal of application allowed must be a string",
  }),
  negativeLeaveBalanceAllowedUpTo: Joi.string().messages({
    "string.base": "Negative leave balance allowed up to must be a string",
  }),
  carryForwardLimit: Joi.object({
    duration: Joi.any(),
    limit: Joi.string().messages({
      "string.base": "Carry forward limit must be a string",
    }),
  }).messages({
    "object.base": "Carry forward limit must be an object",
  }),
  enCashment: Joi.boolean().messages({
    "boolean.base": "Encashment must be a boolean",
  }),
  enCashmentCalculation: Joi.any(),
  maxDaysEnCashable: Joi.string().messages({
    "string.base": "Max days encashable must be a string",
  }),
  enCashmentAt: Joi.any(),
  allowApplicationsOnBehalfOfOthers: Joi.any(),
  showLeaveDataInPayslips: Joi.array().messages({
    "array.base": "Show leave data in payslips must be an array",
  }),
  allowAsPlannedLeave: Joi.any(),
  assignedTo: Joi.array()
    .items(
      Joi.object({
        employee_number: Joi.string().required(),
        name: Joi.string().required(),
      })
    )
    .optional(),
});
