import { body } from 'express-validator';

export const validateUser = [
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('age').optional().isNumeric(),
];
