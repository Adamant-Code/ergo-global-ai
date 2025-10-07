import { CustomError } from "./CustomError.js";

export class NotFoundError extends CustomError {
  constructor(
    message: string = "Resource not found",
    code: string = "NOT_FOUND"
  ) {
    super(message, 404, code);
  }
}
