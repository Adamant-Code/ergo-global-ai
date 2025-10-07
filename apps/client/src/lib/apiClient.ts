import {
  AppError,
  HTTPError,
  parseError,
  NetworkError,
  isNetworkError,
  processFetchResponseError,
} from "@/lib/errors";
import { getSession, signOut } from "next-auth/react";
import { AccessTokenResponse } from "@request-response/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch-based API client that handles authentication and error handling
 */
async function fetchClient<TResponseData>(
  endpoint: string,
  options: RequestInit = {}
): Promise<TResponseData> {
  // Default fetch options
  const defaultOptions: RequestInit = {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };

  // Combine default options with provided options
  const fetchOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Add access token to request headers if available
  const session = await getSession();
  const isTokenValid =
    session?.accessToken && session?.accessTokenExpires > Date.now();

  if (isTokenValid)
    (
      fetchOptions.headers as Record<string, string>
    ).Authorization = `Bearer ${session.accessToken}`;

  try {
    // Make the request
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_URL}${endpoint}`;
    let response = await fetch(url, fetchOptions);

    // Skip refresh token logic for authentication endpoints
    const isAuthEndpoint =
      endpoint.includes("/login") ||
      endpoint.includes("/register") ||
      endpoint.includes("/auth/reset-password");

    // Handle 401 Unauthorized
    if (response.status === 401 && !isAuthEndpoint) {
      try {
        const refreshRes = await fetch(
          `${API_URL}/auth/refresh-token`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!refreshRes.ok)
          throw await processFetchResponseError(refreshRes);

        const data = (await refreshRes.json()) as AccessTokenResponse;

        // Retry the original request with the new token
        (
          fetchOptions.headers as Record<string, string>
        ).Authorization = `Bearer ${data.accessToken}`;
        response = await fetch(url, fetchOptions);
      } catch (refreshError: unknown) {
        await signOut({ redirect: true, callbackUrl: "/login" });

        // Convert any refresh error to a consistent HTTP error
        if (refreshError instanceof AppError) throw refreshError;

        throw new HTTPError(
          "Session expired. Please sign in again.",
          401
        );
      }
    }

    // Use the helper to process response errors
    if (!response.ok) throw await processFetchResponseError(response);

    // For successful responses, determine if we need to return JSON or something else
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json"))
      return (await response.json()) as TResponseData;

    return response as TResponseData;
  } catch (error) {
    // Convert all errors to application errors for consistent handling
    const appError = parseError(error);

    // For network errors, provide a specific message
    if (isNetworkError(error))
      throw new NetworkError(
        "Network error: Please check your connection."
      );

    // Forward all other errors with their original information
    throw appError;
  }
}

// Define strict types for the API client
type ApiClientMethod<TResponseData> = <TResponse = TResponseData>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit
) => Promise<TResponse>;

interface ApiClient {
  get: ApiClientMethod<unknown>;
  post: ApiClientMethod<unknown>;
  put: ApiClientMethod<unknown>;
  patch: ApiClientMethod<unknown>;
  delete: ApiClientMethod<unknown>;
  request: <TResponseData>(
    endpoint: string,
    options?: RequestInit
  ) => Promise<TResponseData>;
}

// Create convenience methods for different HTTP verbs
const apiClient: ApiClient = {
  get: <T>(
    endpoint: string,
    data?: unknown,
    options: RequestInit = {}
  ) =>
    fetchClient<T>(endpoint, {
      ...options,
      method: "GET",
      ...(typeof data !== "undefined" && {
        body: JSON.stringify(data),
      }),
      credentials: "include",
    }),

  post: <T>(
    endpoint: string,
    data?: unknown,
    options: RequestInit = {}
  ) =>
    fetchClient<T>(endpoint, {
      ...options,
      method: "POST",
      ...(typeof data !== "undefined" && {
        body: JSON.stringify(data),
      }),
      credentials: "include",
    }),

  put: <T>(
    endpoint: string,
    data?: unknown,
    options: RequestInit = {}
  ) =>
    fetchClient<T>(endpoint, {
      ...options,
      method: "PUT",
      ...(typeof data !== "undefined" && {
        body: JSON.stringify(data),
      }),
      credentials: "include",
    }),

  patch: <T>(
    endpoint: string,
    data?: unknown,
    options: RequestInit = {}
  ) =>
    fetchClient<T>(endpoint, {
      ...options,
      method: "PATCH",
      ...(typeof data !== "undefined" && {
        body: JSON.stringify(data),
      }),
      credentials: "include",
    }),

  delete: <T>(
    endpoint: string,
    data?: unknown,
    options: RequestInit = {}
  ) =>
    fetchClient<T>(endpoint, {
      ...options,
      method: "DELETE",
      ...(typeof data !== "undefined" && {
        body: JSON.stringify(data),
      }),
      credentials: "include",
    }),

  // The raw fetch client in case it's needed
  request: fetchClient,
};

export default apiClient;
