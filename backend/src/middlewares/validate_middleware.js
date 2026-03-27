import { validationResult } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {

    // ✅ Run all validations first
    for (const validation of validations) {
      await validation.run(req);
    }

    // ✅ Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(e => ({
          field: e.path,
          message: e.msg
        }))
      });
    }

    next();
  };
};