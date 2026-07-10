import { Message } from "@mui-verse/ui/components/chat";
import { ApiResponse } from "./api";

export interface Conversation {
  id: string;
  title: string;
  pinned: boolean;
}

export interface ConversationMessagesResponse extends ApiResponse {
  data: Message[];
}
