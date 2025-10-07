import "dotenv/config";
import debugLib from "debug";
import { UserSession } from "../services/userSession.js";

const socketDebug = debugLib(
  "server/src:routes:chat:libs:streamResponse"
);

export interface StreamResponseParams {
  model?: string;
  message: string;
  chunks: string[];
  session: UserSession;
  conversationId: string;
  abortSignal: AbortSignal;
  event: "llm_response_chunk" | "llm_title_chunk";
  prev_messages?: { role: "user" | "assistant" }[];
}

/**
 * This function handles streaming responses from the LLM API, allowing for cancellation.
 */
async function streamResponse({
  model,
  event,
  chunks,
  message,
  session,
  abortSignal,
  prev_messages,
  conversationId,
}: StreamResponseParams) {
  if (abortSignal.aborted)
    throw new Error("Request was cancelled before starting");

  const response = await fetch(
    `${process.env.AI_SERVICE_URL}/chat/stream`,
    {
      method: "POST",
      signal: abortSignal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        ...(model && { model }),
        ...(prev_messages && { prev_messages }),
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}: ${response.statusText}`
    );
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("Failed to get response reader");

  try {
    while (true) {
      if (abortSignal.aborted) {
        await reader.cancel();
        throw new Error("Stream was cancelled");
      }

      const { done, value } = await reader.read();
      if (done) break;

      const chunk = Buffer.from(value).toString("utf-8");

      if (!abortSignal.aborted) {
        await session.emit(event, { chunk, conversationId });
        chunks.push(chunk);
      }
    }
  } finally {
    try {
      await reader.cancel();
    } catch {}
  }
}

export const streamPromptResponse = async (
  data: StreamResponseParams
) => streamResponse(data);

export const streamTitleResponse = async (
  data: StreamResponseParams
) => streamResponse(data);
