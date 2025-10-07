/**
 * Represents the health check response for the service.
 *
 * This interface provides the basic information regarding the service's health status,
 * including the overall status, uptime, and the timestamp when the response was generated.
 * Optionally, it may also include details about the health of an associated AI service.
 *
 * @property status - The overall health status of the service.
 * @property uptime - (Optional) The uptime of the service in seconds.
 * @property timestamp - (Optional) The time when the health check was performed.
 * @property aiService - (Optional) An object representing the health status of the AI service.
 * @property aiService.status - The health status of the AI service.
 */
export interface HealthResponse {
  status: string;
  uptime?: number;
  timestamp?: string;
  aiService?: { status: string };
}
