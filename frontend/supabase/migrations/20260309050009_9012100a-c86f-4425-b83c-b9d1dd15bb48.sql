
-- Report helpers table (track who helped)
CREATE TABLE public.report_helpers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (report_id, user_id)
);

ALTER TABLE public.report_helpers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Helpers viewable by everyone" ON public.report_helpers FOR SELECT USING (true);
CREATE POLICY "Users can insert own help" ON public.report_helpers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own help" ON public.report_helpers FOR DELETE USING (auth.uid() = user_id);

-- Report flags table (moderation)
CREATE TABLE public.report_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL CHECK (reason IN ('spam', 'incorrect', 'inappropriate', 'duplicate')),
  details text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (report_id, user_id)
);

ALTER TABLE public.report_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can flag reports" ON public.report_flags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own flags" ON public.report_flags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all flags" ON public.report_flags FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Add update policy to messages for marking as read
CREATE POLICY "Users can mark messages as read" ON public.messages FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = messages.conversation_id
    AND conversation_participants.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = messages.conversation_id
    AND conversation_participants.user_id = auth.uid()
  )
);
