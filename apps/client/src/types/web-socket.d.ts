export interface Message {
  text: string;
  isUser: boolean;
}

export interface Conversations {
  [key: string]: Message[];
}

export interface EventData {
  chunk?: string;
  error?: string;
  placeholderId?: string;
  conversationId: string;
  type:
    | "ping"
    | "error"
    | "stream_end"
    | "llm_title_chunk"
    | "llm_response_chunk"
    | "conversation_created";
}
