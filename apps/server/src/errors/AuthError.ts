import { CustomError } from "./CustomError.js";

export class AuthError extends CustomError {
  constructor(message: string, status: number, code: string) {
    super(message, status, code);
  }
}

export class InvalidTokenError extends AuthError {
  constructor(message: string = "Invalid token") {
    super(message, 401, "INVALID_TOKEN");
  }
}

export class ExpiredTokenError extends AuthError {
  constructor(message: string = "Token has expired") {
    super(message, 401, "TOKEN_EXPIRED"); //
  }
}

export class BlacklistedTokenError extends AuthError {
  constructor(message: string = "Token has been revoked") {
    super(message, 403, "TOKEN_BLACKLISTED");
  }
}

export class InvalidCredentialsError extends CustomError {
  statusCode = 401;
  errorCode = "INVALID_CREDENTIALS";

  constructor(message: string) {
    super(message, 401, "INVALID_CREDENTIALS");
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }

  serializeErrors() {
    return {
      code: this.errorCode,
      message: this.message,
      status: this.statusCode,
    };
  }
}
