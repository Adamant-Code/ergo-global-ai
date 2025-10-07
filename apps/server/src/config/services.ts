import "dotenv/config";
import debugLib from "debug";

const debug = debugLib("server/config:service");

const BACKEND_URL = process.env.BACKEND_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

if (!FRONTEND_URL || !BACKEND_URL) {
  debug("Missing required service URLs in .env");
  throw new Error(
    "FRONTEND_URL and BACKEND_URL must be defined in .env"
  );
}

debug(`Backend URL: ${BACKEND_URL}`);
debug(`Frontend URL: ${FRONTEND_URL}`);
if (AI_SERVICE_URL) {
  debug(`AI Service URL: ${AI_SERVICE_URL}`);
} else {
  debug("AI Service URL not defined, skipping");
}

/**
 * An object that holds the URLs for various services used within the application.
 */
export const serviceUrls = {
  backend: BACKEND_URL,
  frontend: FRONTEND_URL,
  aiService: AI_SERVICE_URL || null,
};
