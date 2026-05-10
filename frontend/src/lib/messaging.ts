/**
 * Find or create a conversation between two users.
 * Returns the conversation id.
 */
export async function findOrCreateConversation(
  currentUserId: string,
  otherUserId: string
): Promise<string> {
  // MOCK: Return a fake conversation ID
  return `mock-convo-${currentUserId}-${otherUserId}`;
}
