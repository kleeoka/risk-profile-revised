
# SmartStart Live — Supabase Edition (Full)

## Setup

1. Copy `.env.example` to `.env.local` and fill in keys:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - NEXT_PUBLIC_ALPHAVANTAGE_KEY

2. Install dependencies:
   npm install

3. Run locally:
   npm run dev

4. Create Supabase table (SQL):
   create table risk_profiles (
     id uuid primary key default uuid_generate_v4(),
     user_id text,
     risk_level text,
     responses jsonb,
     created_at timestamp default now()
   );

5. Deploy to Vercel — set same environment variables in the Vercel dashboard.
