-- Run this in Supabase SQL Editor after creating your project.
-- Then add a user in Authentication > Users (or sign up via the app) for admin access.

create table if not exists public.topics (
  id text primary key,
  section text not null,
  title text not null,
  photo text,
  preview text,
  content text
);

create table if not exists public.quotes (
  id text primary key,
  quote_text text not null,
  author text not null,
  reflection text
);

alter table public.topics enable row level security;
alter table public.quotes enable row level security;

-- Anyone can read
create policy "topics read" on public.topics for select using (true);
create policy "quotes read" on public.quotes for select using (true);

-- Only authenticated users can write
create policy "topics write" on public.topics for all using (auth.role() = 'authenticated');
create policy "quotes write" on public.quotes for all using (auth.role() = 'authenticated');

-- Seed default content (run once)
insert into public.topics (id, section, title, photo, preview, content) values
  ('usa', 'countries', 'USA', 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop', 'Where ancient temples meet neon-lit streets, and every meal feels like a ceremony.', 'Where ancient temples meet neon-lit streets, and every meal feels like a ceremony. The attention to detail in everything—from train schedules to tea ceremonies—taught me that excellence is in the small things.'),
  ('iceland', 'countries', 'Iceland', 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop', 'A land of fire and ice where nature reminds you how small you are.', 'A land of fire and ice where nature reminds you how small you are. The midnight sun in summer and the northern lights in winter—both experiences that reset your sense of time and place.'),
  ('getting-lost', 'outdoors', 'The Art of Getting Lost', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'Sometimes the best trails are the ones you never planned to take.', 'Sometimes the best trails are the ones you never planned to take. Getting lost isn''t a failure—it''s an opportunity to discover something you didn''t know you were looking for.'),
  ('rain-hiking', 'outdoors', 'Why Rain Makes Everything Better', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop', 'There''s something about hiking in the rain that clears your head.', 'There''s something about hiking in the rain that clears your head. The sound, the smell, the way everything looks more alive. Plus, you get the trails all to yourself.'),
  ('packing', 'guides', 'How to Pack Like You Actually Know What You''re Doing', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop', 'Lessons learned from one too many overstuffed suitcases.', 'Lessons learned from one too many overstuffed suitcases. The golden rule: if you think you might need it, you probably don''t. But always pack an extra pair of socks.'),
  ('multi-day-hike', 'guides', 'Your First Multi-Day Hike: A Friendly Reality Check', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop', 'Everything I wish someone had told me before my first backpacking trip.', 'Everything I wish someone had told me before my first backpacking trip. Spoiler: it''s going to hurt, but it''s also going to be amazing. Here''s how to prepare.')
on conflict (id) do nothing;

insert into public.quotes (id, quote_text, author, reflection) values
  ('lao-tzu', 'The journey of a thousand miles begins with a single step.', 'Lao Tzu', 'A reminder that every big adventure starts with a single step. I think about this whenever I''m procrastinating on something that feels too big to tackle. Just start.'),
  ('tolkien', 'Not all those who wander are lost.', 'J.R.R. Tolkien', 'This one hits different when you''re actually lost on a trail. But more seriously, it''s a beautiful reminder that exploration and curiosity are valid life paths, not just detours.'),
  ('proust', 'The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.', 'Marcel Proust', 'Travel isn''t just about going places—it''s about learning to see differently. The same principle applies to revisiting familiar places or ideas with fresh perspective.')
on conflict (id) do nothing;
