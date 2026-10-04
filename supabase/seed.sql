-- Demo seed (run after creating auth users and replacing UUIDs)
-- Example admin: update user_roles set role = 'admin' where user_id = '<your-user-uuid>';

insert into public.skills (slug, name) values
  ('video-editing', 'Video editing'),
  ('graphic-design', 'Graphic design'),
  ('social-media', 'Social media'),
  ('coding', 'Coding'),
  ('content-writing', 'Content writing')
on conflict (slug) do nothing;

insert into public.learning_tracks (slug, title, description) values
  ('video-editing-fundamentals', 'Video Editing Fundamentals', 'Learn cuts, pacing, and export for social.'),
  ('social-media-growth', 'Social Media Growth', 'Content strategy and analytics for brands.')
on conflict (slug) do nothing;
