export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  // id represents the serial primary key of this message in storage, it will
  // be used to query the historical messages.
  id?: number;
  message_id: string;
  role: MessageRole;
  content: string;
  annotations?: MessageAnnotation[];
}

export interface MessageAnnotation {
  id: number;
  message_id: string;
  start_index: number;
  end_index: number;
  payload: AnnotationPayload;
}

export interface AnnotationPayload {
  title: string;
  url: string;
  site_name?: string;
  icon?: string;
}
