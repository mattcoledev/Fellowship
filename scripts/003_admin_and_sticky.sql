-- Add is_admin flag to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Add is_sticky flag to threads
ALTER TABLE public.threads
  ADD COLUMN IF NOT EXISTS is_sticky BOOLEAN NOT NULL DEFAULT false;

-- Index so sticky-first ordering is fast
CREATE INDEX IF NOT EXISTS idx_threads_sticky ON public.threads(is_sticky DESC, created_at DESC);

-- Allow admins to update any thread (sticky toggle + moderation)
CREATE POLICY "threads_update_admin" ON public.threads
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Allow admins to delete any thread
CREATE POLICY "threads_delete_admin" ON public.threads
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
