import { query } from "express-validator";

export const GET_FILE_VALIDATION = [
  query("quality")
    .optional()
    .isInt({ min: 10, max: 100 })
    .withMessage("Quality must be between 10 and 100"),
];
