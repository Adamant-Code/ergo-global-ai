import { CustomError } from "./CustomError.js";

export class DatabaseError extends CustomError {
  constructor(
    message: string = "Database operation failed",
    code: string = "DATABASE_ERROR"
  ) {
    super(message, 500, code);
  }
}
