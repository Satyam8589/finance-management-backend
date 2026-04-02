import Joi from 'joi';
import AppError from '../../utils/AppError.js';

export const updateRoleSchema = Joi.object({
  role: Joi.string().valid('viewer', 'analyst', 'admin').required().messages({
    'any.only': 'Role must be one of: viewer, analyst, admin',
    'string.empty': 'Role is required',
  }),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive').required().messages({
    'any.only': 'Status must be either: active or inactive',
    'string.empty': 'Status is required',
  }),
});

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  });

  if (error) {
    const errorMessage = error.details.map((d) => d.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }

  req.body = value;
  next();
};
