import Joi from "joi";

export const applicationValidationSchema = Joi.object({
  assignTasks: Joi.array()
    .items(
      Joi.object({
        person: Joi.object().optional(),
        task: Joi.string().optional(),
      })
    )
    .optional(),
  applicationType: Joi.string().required(),
  behalfOfSomeoneElse: Joi.object({
    employee: Joi.object().optional(),
    isSelected: Joi.boolean().optional(),
  }).optional(),
  description: Joi.string().optional(),
  endDate: Joi.object({
    date: Joi.date().iso().optional(),
  }).optional(),
  leaveType: Joi.string().optional(),
  reasonForLeave: Joi.string().valid("health", "family", "other").optional(),
  startDate: Joi.object({
    date: Joi.date().iso().optional(),
    halfDay: Joi.boolean().optional(),
    whichHalf: Joi.string().valid("first", "second").optional(),
  }).optional(),
  supportingDocuments: Joi.array().items(Joi.string()).optional(),
});
