export abstract class CustomError extends Error {
    public readonly code: string;
    public readonly status: number;
  
    constructor(message: string, status: number, code: string) {
      super(message);
      this.code = code;
      this.status = status;
      Error.captureStackTrace(this, this.constructor);
    }
  }