import { Message } from "@mui-verse/ui/components/chat";
import { ApiResponse } from "./api";

export interface Conversation {
  id: number;
  conversation_id: string;
  title: string;
  pinned: boolean;
}

export interface ConversationMessagesResponse extends ApiResponse {
  data: Message[];
}

export interface MessageSearch extends Message {
  conversation_id: string;
  title: string;
}

export interface ConversationResponse extends ApiResponse {
  data: Conversation;
}
