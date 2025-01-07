import Joi from "joi";

export const CompOffVariantSchema = Joi.object({
  id: Joi.number().optional(),
  unitsAllowed: Joi.array()
    .items(
      Joi.object({
        unit: Joi.string().required(),
        duration: Joi.string().required(),
      })
    )
    .required(),
  minimumHoursRequired: Joi.string().required(),
  variantName: Joi.string().required(),
  description: Joi.string().required(),
  maxCompOffApplications: Joi.object({
    duration: Joi.string().required(),
    count: Joi.string().required(),
  }).required(),
  requiresReviewWorkflow: Joi.boolean().required(),
  approvalRequestsMadeBefore: Joi.string().required(),
  availedWithin: Joi.string().required(),
  allowNonWorkingDays: Joi.boolean().required(),
  withdrawalOfApplicationAllowed: Joi.string().required(),
  compOffsDuringNoticePeriod: Joi.boolean().required(),
  carryForwardEnabled: Joi.boolean().required(),
  carryForwardLapseIn: Joi.object({
    duration: Joi.string().required(),
    limit: Joi.string().required(),
  }).required(),
  carryForwardToNextCycle: Joi.string().required(),
  compensationEnabled: Joi.boolean().required(),
  maxDaysThatCanBeEncashed: Joi.object({
    days: Joi.string().required(),
    hours: Joi.string().required(),
  }).required(),
  compensationOptions: Joi.array()
    .items(
      Joi.object({
        option: Joi.string().required(),
        subOptions: Joi.array().items(Joi.string()).required(),
      })
    )
    .required(),
  assignedTo: Joi.array()
    .items(
      Joi.object({
        employee_number: Joi.string().required(),
        name: Joi.string().required(),
      })
    )
    .optional(),
});
