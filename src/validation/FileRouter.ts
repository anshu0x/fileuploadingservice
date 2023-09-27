import { param, query } from "express-validator";

export const GET_SINGLE_FILE = [
  query("quality")
    .optional()
    .isInt({ min: 10, max: 100 })
    .withMessage("Quality must be between 10 and 100"),
];

export const DELETE_SINGLE_FILE = [param("id").isInt()];
