import { CustomError } from "./CustomError.js";

export class ValidationError extends CustomError {
  constructor(
    message: string = "Validation failed",
    code: string = "VALIDATION_ERROR"
  ) {
    super(message, 400, code);
  }
}
