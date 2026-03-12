ALTER TABLE posts ADD COLUMN IF NOT EXISTS read_next_ids uuid[] DEFAULT '{}';
