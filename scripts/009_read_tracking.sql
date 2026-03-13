-- Add last_activity_at to posts (bumped when a comment is added)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS last_activity_at timestamptz;
UPDATE posts SET last_activity_at = COALESCE(published_at, created_at) WHERE last_activity_at IS NULL;
ALTER TABLE posts ALTER COLUMN last_activity_at SET DEFAULT now();

-- Per-user thread read records
CREATE TABLE IF NOT EXISTS thread_reads (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id uuid REFERENCES threads(id) ON DELETE CASCADE,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, thread_id)
);

-- Per-user post read records
CREATE TABLE IF NOT EXISTS post_reads (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

-- RLS
ALTER TABLE thread_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "thread_reads_own" ON thread_reads
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "post_reads_own" ON post_reads
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
