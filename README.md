# Monorepo - Next.js & NestJS

A monorepo containing a Next.js frontend application and a NestJS backend API.

## Structure

```
task-manager/
├── apps/
│   ├── web/          # Next.js app (TypeScript)
│   └── api/          # NestJS app (TypeScript)
├── package.json
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Docker and Docker Compose (for PostgreSQL)

Install pnpm if you haven't already:
```bash
npm install -g pnpm
```

### Installation

1. Install all dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
# Create a .env file in the root directory
cp .env.example .env

# Create a .env file in the API directory
cp apps/api/.env.example apps/api/.env

# Edit .env files with your preferred database credentials
```

3. Setup database (one command):
```bash
pnpm db:setup
```

This will start PostgreSQL, generate Prisma Client, and run migrations.

### Development

Run both apps in development mode:
```bash
pnpm dev
```

Or run them individually:

**Next.js app (port 3000):**
```bash
pnpm --filter web dev
```

**NestJS API (port 3001):**
```bash
pnpm --filter api dev
```

### Build

Build all apps:
```bash
pnpm build
```

Or build individually:
```bash
pnpm --filter web build
pnpm --filter api build
```

## Apps

### Web (Next.js)
- **Location:** `apps/web`
- **Port:** 3000
- **Tech:** Next.js 14, React 18, TypeScript

### API (NestJS)
- **Location:** `apps/api`
- **Port:** 3001
- **Tech:** NestJS 10, TypeScript, Prisma ORM

## Database

The project uses PostgreSQL running in Docker with Prisma ORM.

### Quick Start

```bash
# Complete database setup
pnpm db:setup

# Start database
pnpm db:start

# View database visually
pnpm db:studio

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed
```

### Database Commands

```bash
# Setup (first time)
pnpm db:setup              # Complete setup (start + generate + migrate)

# Daily Development
pnpm db:start              # Start PostgreSQL container
pnpm db:migrate            # Create and apply migration
pnpm db:studio             # Open Prisma Studio (localhost:5555)

# Data Management
pnpm db:seed               # Seed database with test data
pnpm db:reset              # Reset database (⚠️ deletes all data)

# Other
pnpm db:stop               # Stop PostgreSQL container
pnpm db:logs               # View PostgreSQL logs
```

### Typical Workflow

1. **Edit your schema**: Modify `apps/api/prisma/schema.prisma`
2. **Create migration**: `pnpm db:migrate` (give it a descriptive name)
3. **View changes**: `pnpm db:studio`

### Advanced Operations

For production deployments or reviewing migrations before applying:

```bash
cd apps/api
pnpm db:migrate:create     # Create migration without applying (review SQL first)
pnpm db:migrate:deploy     # Deploy migrations to production
pnpm db:format             # Auto-format schema.prisma
```

### Configuration

Default credentials (can be changed in `.env`):
- **Host:** localhost
- **Port:** 5432
- **Database:** taskmanager
- **User:** taskmanager
- **Password:** taskmanager
