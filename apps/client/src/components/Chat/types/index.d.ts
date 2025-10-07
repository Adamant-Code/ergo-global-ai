import { Conversations } from "@/types/web-socket";

export interface NewChatProps {
  message: string;
  handleSendMessage: () => void;
  handleChangeMessage: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleKeyDownSendMessage: (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => false | void;
}

export interface TypingIndicatorProps {
  conversationId?: string;
  messages: Conversations;
}

export type MessageContainerProps = Pick<TypingIndicatorProps> & {};

export interface ConversationInputProps {
  message: string;
  handleSendMessage: () => void;
  handleChangeMessage: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleKeyDownSendMessage: (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => false | void;
}

export type ConversationContainerProps = ConversationInputProps & {
  slug?: string;
  placeholderId: string;
};
