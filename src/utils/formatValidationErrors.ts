import { ZodError } from 'zod';

export const formatValidationErrors = (
  validationResult: ZodError
) => {
  const formattedErrors = validationResult.errors.map(err => {
    return {
      path: err.path.join('.'),
      message: err.message,
    };
  });

  return formattedErrors;
};
