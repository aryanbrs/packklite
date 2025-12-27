# Packklite
 
Packklite is a Next.js app for managing packaging products, quotes, and orders, with an admin dashboard.
 
## Tech
 
- Next.js (App Router)
- Prisma + PostgreSQL
- Tailwind CSS

## Local Development

1. Install dependencies

```bash
npm install
```

2. Configure environment variables

Create a `.env` file (do not commit it) with at least:

```bash
DATABASE_URL=...
JWT_SECRET=...
```

3. Generate Prisma client and run migrations

```bash
npx prisma generate
npx prisma migrate dev
```

4. Start the dev server

```bash
npm run dev
```

Open http://localhost:3000

## Deploy

- Set environment variables in your hosting provider (e.g. Vercel)
- Run `npx prisma migrate deploy` against the production database
