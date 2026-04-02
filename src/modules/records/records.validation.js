import Joi from 'joi';
import AppError from '../../utils/AppError.js';

export const createRecordSchema = Joi.object({
  amount: Joi.number().integer().required().min(0).messages({
    'number.base': 'Amount must be a number',
    'number.integer': 'Amount must be a whole number (e.g. store 1500 for ₹15.00)',
    'number.min': 'Amount cannot be negative',
  }),
  type: Joi.string().valid('income', 'expense').required().messages({
    'any.only': 'Type must be either: income or expense',
  }),
  category: Joi.string().required().trim().min(2).max(50),
  date: Joi.date().iso().optional().default(() => new Date()),
  notes: Joi.string().optional().allow('', null).max(255),
});

export const updateRecordSchema = Joi.object({
  amount: Joi.number().integer().min(0).optional(),
  type: Joi.string().valid('income', 'expense').optional(),
  category: Joi.string().trim().min(2).max(50).optional(),
  date: Joi.date().iso().optional(),
  notes: Joi.string().optional().allow('', null).max(255),
});

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const msg = error.details.map((d) => d.message).join(', ');
    return next(new AppError(msg, 400));
  }

  req.body = value;
  next();
};
