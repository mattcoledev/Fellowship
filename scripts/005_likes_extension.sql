-- comment_likes
create table if not exists comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid references comments(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(comment_id, user_id)
);

alter table comment_likes enable row level security;

create policy "Anyone can view comment likes" on comment_likes for select using (true);
create policy "Users can like comments" on comment_likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike comments" on comment_likes for delete using (auth.uid() = user_id);

create index if not exists comment_likes_comment_id_idx on comment_likes(comment_id);

-- thread_likes
create table if not exists thread_likes (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references threads(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(thread_id, user_id)
);

alter table thread_likes enable row level security;

create policy "Anyone can view thread likes" on thread_likes for select using (true);
create policy "Users can like threads" on thread_likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike threads" on thread_likes for delete using (auth.uid() = user_id);

create index if not exists thread_likes_thread_id_idx on thread_likes(thread_id);

-- reply_likes
create table if not exists reply_likes (
  id uuid primary key default gen_random_uuid(),
  reply_id uuid references replies(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(reply_id, user_id)
);

alter table reply_likes enable row level security;

create policy "Anyone can view reply likes" on reply_likes for select using (true);
create policy "Users can like replies" on reply_likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike replies" on reply_likes for delete using (auth.uid() = user_id);

create index if not exists reply_likes_reply_id_idx on reply_likes(reply_id);
