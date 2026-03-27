import { supabase } from "@/integrations/supabase/client";

/**
 * Find or create a conversation between two users.
 * Returns the conversation id.
 */
export async function findOrCreateConversation(
  currentUserId: string,
  otherUserId: string
): Promise<string> {
  // Find existing conversation where both users are participants
  const { data: myConvos } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", currentUserId);

  if (myConvos?.length) {
    const myConvoIds = myConvos.map((c) => c.conversation_id);

    const { data: shared } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", otherUserId)
      .in("conversation_id", myConvoIds);

    if (shared?.length) {
      return shared[0].conversation_id;
    }
  }

  // Create new conversation
  const { data: convo, error: convoErr } = await supabase
    .from("conversations")
    .insert({})
    .select("id")
    .single();
  if (convoErr || !convo) throw convoErr ?? new Error("Failed to create conversation");

  // Add both participants
  const { error: partErr } = await supabase.from("conversation_participants").insert([
    { conversation_id: convo.id, user_id: currentUserId },
    { conversation_id: convo.id, user_id: otherUserId },
  ]);
  if (partErr) throw partErr;

  return convo.id;
}
