-- Invite-only membership system
-- Run this in the Supabase SQL Editor

-- 1. Add member_status to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS member_status TEXT DEFAULT NULL
  CHECK (member_status IN ('active', 'disabled'));

-- Set all existing members to active so they aren't locked out
UPDATE public.profiles SET member_status = 'active' WHERE member_status IS NULL;

-- 2. Create invites table
CREATE TABLE IF NOT EXISTS public.invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  invited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_invites_email_pending
  ON public.invites(email)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_invites_status ON public.invites(status);

-- 3. Enable RLS on invites
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Only admins can read and manage invites
CREATE POLICY "invites_admin_all" ON public.invites
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
