import Joi from "joi";

export const roleValidationSchema = Joi.object({
  id: Joi.number().optional(),
  roleName: Joi.string()
    .required()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9_ -]*$/)
    .messages({
      "any.required": "Role name is required.",
      "string.min": "Role name must be at least 3 characters long.",
      "string.max": "Role name must be at most 50 characters long.",
      "string.pattern.base":
        "Role name can only contain letters, numbers, underscores, hyphens, and spaces.",
    }),
  leaveApproval: Joi.object({
    view: Joi.boolean().required().messages({
      "any.required": "Leave approval view permission is required.",
    }),
    modify: Joi.boolean().required().messages({
      "any.required": "Leave approval modify permission is required.",
    }),
  })
    .required()
    .messages({
      "any.required": "Leave approval permissions are required.",
    }),
  workflows: Joi.object({
    view: Joi.boolean().required().messages({
      "any.required": "Workflow view permission is required.",
    }),
    modify: Joi.boolean().required().messages({
      "any.required": "Workflow modify permission is required.",
    }),
  })
    .required()
    .messages({
      "any.required": "Workflow permissions are required.",
    }),
  leaveTypes: Joi.object({
    view: Joi.boolean().required().messages({
      "any.required": "Leave types view permission is required.",
    }),
    modify: Joi.boolean().required().messages({
      "any.required": "Leave types modify permission is required.",
    }),
  })
    .required()
    .messages({
      "any.required": "Leave types permissions are required.",
    }),
  leaveConfigurations: Joi.object({
    view: Joi.boolean().required().messages({
      "any.required": "Leave configurations view permission is required.",
    }),
    modify: Joi.boolean().required().messages({
      "any.required": "Leave configurations modify permission is required.",
    }),
  })
    .required()
    .messages({
      "any.required": "Leave configurations permissions are required.",
    }),
  ptoConfigurations: Joi.object({
    view: Joi.boolean().required().messages({
      "any.required": "PTO configurations view permission is required.",
    }),
    modify: Joi.boolean().required().messages({
      "any.required": "PTO configurations modify permission is required.",
    }),
  })
    .required()
    .messages({
      "any.required": "PTO configurations permissions are required.",
    }),
  compOffConfigurations: Joi.object({
    view: Joi.boolean().required().messages({
      "any.required": "Comp-Off configurations view permission is required.",
    }),
    modify: Joi.boolean().required().messages({
      "any.required": "Comp-Off configurations modify permission is required.",
    }),
  })
    .required()
    .messages({
      "any.required": "Comp-Off configurations permissions are required.",
    }),
  allowOnBehalfOfOthers: Joi.object({
    Leave: Joi.boolean().required().messages({
      "any.required": "Leave on behalf of others permission is required.",
    }),
    "Comp-Off": Joi.boolean().required().messages({
      "any.required": "Comp-Off on behalf of others permission is required.",
    }),
    PTO: Joi.boolean().required().messages({
      "any.required": "PTO on behalf of others permission is required.",
    }),
  })
    .required()
    .messages({
      "any.required": "On behalf of others permissions are required.",
    }),
  sector: Joi.array().items(Joi.string()).optional(),
  subLocation: Joi.array().items(Joi.string()).optional(),
  orgState: Joi.array().items(Joi.string()).optional(),
  costCenter: Joi.array().items(Joi.string()).optional(),
  subDepartment: Joi.array().items(Joi.string()).optional(),
  businessUnit: Joi.array().items(Joi.string()).optional(),
  lineOfBusiness: Joi.array().items(Joi.string()).optional(),
  department: Joi.array().items(Joi.string()).optional(),
  project: Joi.array().items(Joi.string()).optional(),
  customer: Joi.array().items(Joi.string()).optional(),
  workStream: Joi.array().items(Joi.string()).optional(),
  activities: Joi.array().items(Joi.string()).optional(),
  programme: Joi.array().items(Joi.string()).optional(),
  process: Joi.array().items(Joi.string()).optional(),
  subProcess: Joi.array().items(Joi.string()).optional(),
  level: Joi.array().items(Joi.string()).optional(),
  location: Joi.array().items(Joi.string()).optional(),
  division: Joi.array().items(Joi.string()).optional(),
  function: Joi.array().items(Joi.string()).optional(),
  designation: Joi.array().items(Joi.string()).optional(),
  assignedTo: Joi.array()
    .items(
      Joi.object({
        employee_number: Joi.string().required(),
        name: Joi.string().required(),
      })
    )
    .optional(),
});
