import { z } from 'zod';

/**
 * Helper function to validate a date field against the current date and time.
 * @returns A Zod refinement for validating dates.
 */
export const futureDateValidation = () =>
  z.preprocess(
    (value) => {
      if (typeof value === 'string' || value instanceof String) {
        return new Date(value.toString()); // Convert ISO string to Date
      }
      return value; // Leave other values unchanged
    },
    z.date().refine((value) => {
      const now = new Date();
      return value >= now; // Ensure the date is in the future
    })
  );
