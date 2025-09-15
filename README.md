# Observator — Link in Bio CMS

Public **link-in-bio** page (3-column gallery) + **mini CMS** for the editorial team: add / edit / delete links, **drag-and-drop reordering**, image upload with **spinner**, and access restricted to approved emails.

Demo: https://linkinbio-observator.netlify.app/

<!-- ![Homepage — 3-column gallery](./public/assets/readme/homepage.jpeg) -->

## <img src="./public/assets/readme/homepage.jpeg" alt="Homepage — 3-column gallery" width="300">

## ✨ Features

- **Public homepage** (`/`): 3-column gallery; clicking an image opens the article.
- **Brand fillers**: if a row misses items, we auto-fill it with brand banners.
- **Authentication** (`/login`): allow-list (approved emails only).
- **Dashboard** (`/dashboard`): list with thumbnail, title, date, status (Published/Draft).
- **Reordering**: drag-and-drop + “Save order”.
- **Create / Edit** (`/dashboard/new`, `/dashboard/edit/[id]`), including image replacement.
- **Validation with Zod** (UI + server actions).
- **Security**: Postgres RLS, server-only env vars, safe image types and size limits.

---

## 🧱 Tech Stack

- **Next.js 15** (App Router, **Server Actions**) + **React**, **TypeScript**
- **Tailwind CSS** for styling
- **Supabase**: Postgres (RLS), Auth, Storage
- **@supabase/ssr** for server-side sessions
- **Zod** for validation
- Hosting on **Netlify**, code on **GitHub**
- Image optimization via **next/image**

---

## ✅ Prerequisites

- **Node.js 18+** (LTS recommended)
- A **Supabase** project
- (Optional) **Netlify** account for deploy

---

## 🔐 Environment Variables

> **Important:** Copy the **`.env.local` file you received** into the **project root** (same folder as `package.json`).  
> Do **not** commit this file.

Required keys (example):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...  # or NEXT_PUBLIC_SUPABASE_ANON_KEY (match your code)

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Login allow-list (comma separated)
ALLOWED_EMAILS=daiana.muflic@yahoo.com,test@test.com
```

## Local Setup

### 1. Clone and install

- git clone https://github.com/<user>/<repo>.git
- cd <repo>
- npm i

### 2. Add environment file

Place the provided .env.local at the project root.

### 3. Run dev

npm run dev
