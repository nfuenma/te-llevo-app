# Te Llevo App

Next.js (App Router) + TypeScript + Prisma + NextAuth (Google) + TanStack Query + MUI.

## Prerequisites

- **Node.js 20+** (project uses `.nvmrc` with v22.15.1 — run `nvm use` if you use nvm)
- **PostgreSQL** (for `DATABASE_URL`)

## Setup (step by step)

### 1. Use the correct Node version

```bash
nvm use
# or: fnm use / volta run
```

### 2. Install dependencies

```bash
npm install
```

This runs `prisma generate` automatically (postinstall).

### 3. Environment variables

Copy the example env and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

- **DATABASE_URL** — PostgreSQL connection string (e.g. `postgresql://user:password@localhost:5432/te_llevo?schema=public`)
- **NEXTAUTH_URL** — App URL (e.g. `http://localhost:3000`)
- **NEXTAUTH_SECRET** — Generate with: `openssl rand -base64 32`
- **GOOGLE_CLIENT_ID** / **GOOGLE_CLIENT_SECRET** — From [Google Cloud Console](https://console.cloud.google.com/) (OAuth 2.0 credentials)

### 4. Database

Create the DB (if needed), then apply the schema:

```bash
npm run db:push
```

Or use migrations:

```bash
npm run db:migrate
```

### 5. Seed roles (optional but recommended)

```bash
npm run db:seed
```

Creates the four roles: superadmin, admin, business, client. New users get **client** on first sign-in.

### 6. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command           | Description              |
|-------------------|--------------------------|
| `npm run dev`     | Start dev server         |
| `npm run build`   | Production build         |
| `npm run start`   | Start production server  |
| `npm run lint`    | Run ESLint on `src`      |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema (no migrations) |
| `npm run db:migrate` | Create/apply migrations |
| `npm run db:studio` | Open Prisma Studio    |

## Project structure (high level)

- **`src/app/`** — App Router: layouts, pages, route groups, `api/` Route Handlers
- **`src/components/`** — Reusable UI and layouts
- **`src/features/`** — Feature modules (auth, etc.)
- **`src/lib/`** — DB (Prisma), auth (NextAuth options), SDK (config, client, types)
- **`src/hooks/api/`** — React Query hooks per entity (categories, businesses, products)
- **`src/theme/`** — MUI theme (light/dark), `createAppTheme`, `ThemeModeProvider`
- **`prisma/`** — Prisma schema (single source of truth; DB columns in `snake_case`)

## Auth

- Sign-in: `/auth/signin` (Google).
- Session is used in API routes via `getServerSession(authOptions)`.
- List/detail GET endpoints are public; POST/PUT/DELETE require an authenticated session.

## Roles

After the first run, seed the roles: `npm run db:seed`. Roles: **superadmin**, **admin**, **business**, **client**.

- **client** — Asignado por defecto al primer login. Solo puede ver el catálogo público. No accede a `/admin`.
- **business** — Puede entrar a `/admin` y ver solo **Mis negocios** y **Productos** de los negocios que administra. No puede crear negocios ni gestionar regiones/categorías. Para dar este rol: añadir `UserRole` (userId + roleId de "business") y `BusinessAdmin` (userId + businessId) por cada negocio que gestiona (p. ej. desde Prisma Studio).
- **admin** — Acceso completo al panel: regiones, categorías, todos los negocios, productos. Puede crear negocios.
- **superadmin** — Igual que admin, sin límites (reservado para gestión global).

Asignar roles: en la base de datos, tabla `roles` tiene los ids por nombre; `user_roles` relaciona usuario con rol; `business_admins` relaciona usuario con negocio para el rol business.
