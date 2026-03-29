-- JINJA MAPS demo schema
-- Run in Supabase SQL Editor

create table if not exists public.places (
  id bigint generated always as identity primary key,
  name text not null,
  category text not null,
  description text not null,
  phone text not null,
  address text not null,
  latitude double precision not null,
  longitude double precision not null,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.ads (
  id bigint generated always as identity primary key,
  title text not null,
  image_url text not null,
  description text not null,
  cta_text text not null,
  cta_link text not null,
  display_order integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.places enable row level security;
alter table public.ads enable row level security;

drop policy if exists "Demo public access places" on public.places;
create policy "Demo public access places"
  on public.places
  for all
  to anon
  using (true)
  with check (true);

drop policy if exists "Demo public access ads" on public.ads;
create policy "Demo public access ads"
  on public.ads
  for all
  to anon
  using (true)
  with check (true);

insert into public.places (name, category, description, phone, address, latitude, longitude, image_url)
values
  ('Source Café Jinja', 'Cafes', 'Specialty coffee and light brunch in a peaceful courtyard.', '+256 700 123456', 'Main Street, Jinja', 0.4492, 33.2049, 'https://images.unsplash.com/photo-1445116572660-236099ec97a0'),
  ('Nile View Hotel', 'Hotels', 'Comfort-focused stays with river-facing rooms and rooftop dining.', '+256 700 234567', 'Nile Crescent Road, Jinja', 0.4388, 33.2028, 'https://images.unsplash.com/photo-1566073771259-6a8506099945'),
  ('Jinja Fresh Mart', 'Grocery', 'Daily groceries, produce, household essentials, and delivery.', '+256 700 345678', 'Clive Road, Jinja', 0.4461, 33.2112, 'https://images.unsplash.com/photo-1542838132-92c53300491e');

insert into public.ads (title, image_url, description, cta_text, cta_link, display_order)
values
  ('Weekend Escape on the Nile', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e', 'Book a premium two-night package with breakfast, spa access, and sunset cruise.', 'Reserve now', 'https://example.com/nile-escape', 1),
  ('Launch Your Business in Jinja', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', 'Need branding, websites, and growth campaigns? Get a quick strategy call this week.', 'Get consultation', 'https://example.com/business-growth', 2);
