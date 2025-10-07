import apiClient from "@/lib/apiClient";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  created_at: string;
  messages: Message[];
}

export interface ConversationListItem {
  id: string;
  title: string;
  placeholder?: boolean;
}

export interface DeletConversationResponse {
  message: string;
  conversation_id: string;
}

class ApiService {
  async getConversations() {
    return apiClient.get<ConversationListItem[]>(`/conversations`);
  }

  async getConversation(conversationId: string) {
    return apiClient.get<Conversation>(
      `/conversations/${conversationId}`
    );
  }

  async deleteConversation(conversationId: string) {
    return apiClient.delete<DeletConversationResponse>(
      `/conversations/${conversationId}`
    );
  }
}

export const apiService = new ApiService();
