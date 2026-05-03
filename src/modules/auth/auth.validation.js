import Joi from 'joi';
import AppError from '../../utils/AppError.js';

export const registerSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100).messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 2 characters long',
  }),
  email: Joi.string().required().trim().email().lowercase().messages({
    'string.email': 'Please provide a valid email address',
  }),
  password: Joi.string().required().min(8).messages({
    'string.min': 'Password must be at least 8 characters long',
  }),
  role: Joi.string().valid('viewer', 'analyst', 'admin').required().messages({
    'any.only': 'Role must be one of: viewer, analyst, admin',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().required().trim().email().lowercase(),
  password: Joi.string().required(),
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.empty': 'Refresh token cannot be empty',
    'any.required': 'Refresh token is required',
  }),
});

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  });

  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }

  req.body = value;
  next();
};
