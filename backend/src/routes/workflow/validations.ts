import Joi from "joi";

export const workflowValidationSchema = Joi.object({
  id: Joi.number().optional(),
  name: Joi.string()
    .required()
    .min(10)
    .max(200)
    .pattern(/^[a-zA-Z0-9_ -]*$/)
    .messages({
      "string.empty": "Workflow name is required",
      "any.required": "Workflow name is required",
      "string.min": "Workflow name must be at least 10 characters long",
      "string.max": "Workflow name must be at most 200 characters long",
      "string.pattern.base":
        "Workflow name can only contain letters, numbers, underscores, hyphens, and spaces.",
    }),
  effectiveDate: Joi.string().allow(null).required(),
  process: Joi.string().required().messages({
    "string.empty": "Process is required",
    "any.required": "Process is required",
  }),
  subProcess: Joi.string().required().messages({
    "string.empty": "Sub-process is required",
    "any.required": "Sub-process is required",
  }),
  createdAt: Joi.string().required(),
  employeesInvolved: Joi.number().required(),
  steps: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required().messages({
          "string.empty": "Step name is required",
          "any.required": "Step name is required",
        }),
        forwardToNext: Joi.boolean().optional(),
        forwardAfter: Joi.object({
          days: Joi.string().optional().allow(""),
          hours: Joi.string().optional().allow(""),
        }).optional(),
        assignedRoles: Joi.array()
          .items(
            Joi.object({
              id: Joi.number().required(),
              name: Joi.string().required(),
            })
          )
          .min(1)
          .required()
          .messages({
            "array.min": "At least one role must be assigned to the step",
            "any.required": "Assigned roles are required",
          }),
        autoApproval: Joi.boolean().optional(),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one step is required",
      "any.required": "Workflow steps are required",
    }),
});
