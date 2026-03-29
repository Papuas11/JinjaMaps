# JINJA MAPS

JINJA MAPS is a **single Next.js App Router** demo web app for local discovery in Jinja, Uganda. It includes:

- Premium discovery panel on `/`
- Large React Leaflet map centered on Jinja
- Demo admin panel on `/admin` (no auth)
- Supabase-backed CRUD for places and ads

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Leaflet + Leaflet
- Supabase

## 1) Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

- Public app: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin`

## 2) Environment variables

Use `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 3) Supabase setup

1. Create a Supabase project.
2. Go to **SQL Editor**.
3. Run the SQL in `supabase/schema.sql`.
4. Copy project URL + anon key from **Project Settings → API** into `.env.local`.

The schema creates two tables:

- `places`
- `ads`

It also adds permissive demo RLS policies for the `anon` role to keep this MVP frictionless.

## 4) Data model

### `places`
- `id`
- `name`
- `category`
- `description`
- `phone`
- `address`
- `latitude`
- `longitude`
- `image_url`
- `created_at`

### `ads`
- `id`
- `title`
- `image_url`
- `description`
- `cta_text`
- `cta_link`
- `display_order`
- `created_at`

## 5) Product behavior

### Public page (`/`)
- Left panel includes search, category shortcuts, premium ad cards, and place cards.
- Right side is a large map focused on Jinja.
- Selecting a place card re-centers the map.
- Clicking marker/popup connects naturally with place discovery.

### Admin page (`/admin`)
- Create/edit/delete places.
- Create/edit/delete ads.
- Saves directly to Supabase.
- Public page auto-loads DB content and shows markers/cards.

## Notes

- This repository intentionally uses **text-only files** for clean PR compatibility.
- No binary assets are included.
- All visual imagery is provided by remote image URLs.
