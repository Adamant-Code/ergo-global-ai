/**
 * Base error class for our application.
 * Contains a status code and flag to determine if error is operational.
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * HTTP error class that extends the AppError.
 * Useful for errors coming from API calls or HTTP operations.
 */
export class HTTPError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}

/**
 * Error class specifically for network-related issues
 */
export class NetworkError extends AppError {
  constructor(
    message: string = "Network error. Please check your internet connection."
  ) {
    super(message, 503);
  }
}

/**
 * Error class for fetch response errors
 */
export class FetchError extends HTTPError {
  public response?: Response;
  public data?: unknown;

  constructor(
    message: string,
    statusCode: number,
    response?: Response,
    data?: unknown
  ) {
    super(message, statusCode);
    this.response = response;
    this.data = data;
  }
}

/**
 * A simple map of common HTTP status codes to their standard messages.
 * This helps in generating default messages for errors when needed.
 */
export const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
};

/**
 * Checks if an error is a fetch-related error
 */
export function isFetchError(error: unknown): error is FetchError {
  return error instanceof FetchError;
}

/**
 * Checks if an error is a network-related error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof NetworkError) return true;

  return (
    error instanceof TypeError &&
    typeof (error as TypeError).message === "string" &&
    (error as TypeError).message.includes("fetch")
  );
}

/**
 * Processes a fetch Response object to extract error information
 */
export async function processFetchResponseError(
  response: Response
): Promise<FetchError> {
  let errorData: {
    message?: string;
    error?: { message?: string; status?: number };
  } | null = null;
  const statusCode = response.status;

  try {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      errorData = await response.json();
    }
  } catch (e) {
    console.error("Error parsing error response:", e);
  }

  const message =
    errorData?.error?.message ||
    errorData?.message ||
    HTTP_STATUS_MESSAGES[statusCode] ||
    response.statusText ||
    "Unknown error occurred";

  return new FetchError(message, statusCode, response, errorData);
}

/**
 * Converts any error to an AppError for consistent error handling
 */
export function parseError(
  error: unknown,
  fallbackMessage = "Something went wrong"
): AppError {
  // Handle our custom errors
  if (error instanceof AppError) return error;

  // Handle fetch response errors
  if (error instanceof Response)
    return new HTTPError(
      error.statusText || fallbackMessage,
      error.status
    );

  // Handle network errors (fetch failures)
  if (isNetworkError(error)) return new NetworkError();

  // Native JS error
  if (error instanceof Error) return new AppError(error.message, 500);

  // Custom thrown objects or values (edge case)
  if (typeof error === "string") return new AppError(error, 500);

  // Fallback
  return new AppError(fallbackMessage, 500);
}
