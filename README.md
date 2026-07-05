# TaskFlow - Task Management App

A full-stack collaborative task management application built with Next.js (App Router), TypeScript, Prisma, and NextAuth.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: NextAuth.js v5 (credentials provider)
- **Styling**: Tailwind CSS
- **Data Mutations**: Server Actions

## Features

- User registration and authentication
- Create, edit, and delete tasks
- Task status management (To Do, In Progress, Done)
- Task priority levels (Low, Medium, High)
- Assign tasks to other users
- Due date tracking with overdue indicators
- Filter tasks by status, priority, and search text
- Dashboard with task count stats
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js 20.9+
- npm

### Setup

1. **Clone the repository**

```bash
git clone <repo-url>
cd task-manager
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and set a secure `AUTH_SECRET` value. You can generate one with:

```bash
npx auth secret
```

4. **Generate Prisma client and run migrations**

```bash
npx prisma generate
npx prisma migrate dev
```

5. **Seed the database with a default user**

```bash
npm run seed
```

This creates a default account you can use to sign in:

| Email               | Password      |
|---------------------|---------------|
| admin@taskflow.com  | password123   |

You can also register a new account from the sign-up page.

6. **Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth pages (login, register)
│   ├── (dashboard)/     # Protected dashboard pages
│   ├── api/             # API routes (auth, register)
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/          # React components
│   ├── Navbar.tsx
│   ├── Providers.tsx
│   ├── TaskCard.tsx
│   ├── TaskFilters.tsx
│   ├── TaskForm.tsx
│   └── TaskList.tsx
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   ├── actions.ts       # Server Actions for task CRUD
│   └── prisma.ts        # Prisma client singleton
└── types/
    └── next-auth.d.ts   # Auth type augmentation
prisma/
├── schema.prisma        # Database schema
└── migrations/          # Migration files
```

## Architectural Decisions

- **Server Components by default**: Dashboard page fetches data server-side, serializes it, and passes to client components. No unnecessary client-side data fetching.
- **Server Actions for mutations**: Task CRUD operations use server actions with `revalidatePath` instead of API routes, reducing boilerplate and keeping mutations collocated.
- **Route groups**: `(auth)` and `(dashboard)` route groups separate public and protected layouts without affecting URLs.
- **SQLite + Prisma**: Chosen for simplicity and zero-configuration setup. Can be swapped to PostgreSQL by changing the datasource in `schema.prisma`.
- **Session-based auth with JWT strategy**: Keeps the stack simple with no external auth service dependency.

## Deployment

Deploy to Vercel:

1. Push to a GitHub repository
2. Import the project on [Vercel](https://vercel.com)
3. Set environment variables (`AUTH_SECRET`, `DATABASE_URL`)
4. Deploy

For production, consider switching from SQLite to PostgreSQL with the appropriate Prisma adapter.
