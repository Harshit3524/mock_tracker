# 📊 Mock Tracker

A private mock exam tracker for two users — log scores, track accuracy, view charts, and share study PDFs.

**Stack:** Next.js 14 · Supabase · Recharts · Tailwind CSS · Vercel

---

## 🚀 Setup Guide (Step by Step)

### Step 1 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **"New Project"** → give it a name (e.g. `mock-tracker`) → choose a region close to you → set a DB password
3. Wait ~1 min for the project to spin up
4. Go to **SQL Editor** (left sidebar) → paste the entire contents of `supabase-schema.sql` → click **Run**
5. Go to **Project Settings → API** and copy:
   - `Project URL` → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### Step 2 — Set up the project locally

```bash
# Clone or download this project
cd mock-tracker

# Install dependencies
npm install

# Create your env file
cp .env.example .env.local
```

Open `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

```bash
# Run locally to test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the landing page!

---

### Step 3 — Push to GitHub

```bash
# Inside the mock-tracker folder:
git init
git add .
git commit -m "Initial commit"

# Create a new repo on github.com (call it mock-tracker)
# Then:
git remote add origin https://github.com/YOUR_USERNAME/mock-tracker.git
git branch -M main
git push -u origin main
```

---

### Step 4 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"** → import your `mock-tracker` repo
3. Before deploying, click **"Environment Variables"** and add:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your Supabase anon key
4. Click **Deploy** 🚀

In ~2 minutes you'll get a live URL like `https://mock-tracker-xyz.vercel.app`

**That's your private URL — share it only with the other person!**

---

## 🏗️ How to Use

### Landing Page (`/`)
- Choose **User 1** or **User 2** dashboard
- Or go to **Compare** to see both side-by-side

### Dashboard (`/dashboard?user=user1`)
- **Scores tab** — add new mock entries (exam name, date, score, accuracy, platform, notes). View all in a table with color-coded badges.
- **Charts tab** — score trend, accuracy trend, and score % bar chart
- **Docs tab** — upload PDFs, view them (signed URLs, expire after 1hr), delete them

### Compare Page (`/compare`)
- Stats table comparing both users
- Head-to-head line charts for score % and accuracy

---

## 🔒 Privacy

- No auth is used — the site is private by URL only
- Share the Vercel URL only with each other
- PDFs are stored privately in Supabase Storage (not public) — they open via temporary signed URLs

---

## 🎨 Customise User Names

To change "User 1" / "User 2" to your actual names:

1. Open `app/page.tsx` — change the button labels
2. Open `app/dashboard/page.tsx` — update the `displayName` logic
3. The `user_name` stored in DB will still be `user1`/`user2` (the URL param), which is fine

---

## 📁 Project Structure

```
mock-tracker/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/page.tsx    # Per-user dashboard
│   ├── compare/page.tsx      # Comparison page
│   ├── api/
│   │   ├── mocks/route.ts    # GET/POST mock entries
│   │   ├── mocks/[id]/route.ts # DELETE mock entry
│   │   └── pdfs/route.ts     # GET/POST/DELETE PDFs
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── AddMockForm.tsx       # Form to add a new mock
│   ├── Charts.tsx            # Recharts visualizations
│   └── PdfSection.tsx        # PDF upload/view/delete
├── lib/
│   └── supabase.ts           # Supabase client + types
├── supabase-schema.sql        # Run this in Supabase SQL Editor
└── .env.example
```
