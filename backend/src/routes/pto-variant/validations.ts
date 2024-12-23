import Joi from "joi";

export const PTOVariantSchema = Joi.object({
  id: Joi.number().optional(),
  unitsAllowed: Joi.array().items(Joi.string()).required(),
  variantName: Joi.string().required(),
  description: Joi.string().required(),
  applicableAfter: Joi.object({
    days: Joi.string().required(),
    duration: Joi.string().required(),
  }).required(),
  requiresReviewWorkflow: Joi.boolean().required(),
  approvalRequestsMadeBefore: Joi.string().required(),
  minimumHoursRequired: Joi.string().required(),
  maxHoursAllowed: Joi.string().required(),
  maxInstances: Joi.object({
    days: Joi.string().required(),
    duration: Joi.string().required(),
  }).required(),
  ptoDuringNoticePeriod: Joi.boolean().required(),
  supportingDocuments: Joi.object({
    status: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
  ptoCrossed: Joi.object({
    option: Joi.string().required(),
    subOptions: Joi.array().items(Joi.string()).required(),
  }).required(),
  ptoGranted: Joi.string().required(),
  assignedTo: Joi.array()
    .items(
      Joi.object({
        employee_number: Joi.string().required(),
        name: Joi.string().required(),
      })
    )
    .optional(),
});
