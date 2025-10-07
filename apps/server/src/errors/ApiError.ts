import { CustomError } from "./CustomError.js";

export class ApiError extends CustomError {
  constructor(
    message: string = "A JSON error occurred",
    status: number = 500,
    code: string = "JSON_ERROR"
  ) {
    super(message, status, code);
  }
}
