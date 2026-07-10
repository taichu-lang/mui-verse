export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  // id represents the serial primary key of this message in storage, it will
  // be used to query the historical messages.
  id?: string;
  message_id: string;
  role: MessageRole;
  content: string;
}
