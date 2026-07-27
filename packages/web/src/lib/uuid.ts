export function genConversationID(): string {
  return crypto.randomUUID();
}
