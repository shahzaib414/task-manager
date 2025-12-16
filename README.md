# Task Manager - Full Stack Application

A modern task management application built with Next.js and NestJS in a monorepo architecture.

## 📚 Tech Stack

### Frontend (Web)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: CSS Modules
- **Drag & Drop**: @dnd-kit (for Kanban board)
- **Data Fetching**: SWR for client-side data fetching
- **Authentication**: JWT-based auth with custom middleware

### Backend (API)
- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Prisma 5
- **Authentication**: JWT with Passport
- **Password Hashing**: bcrypt
- **Validation**: class-validator & class-transformer

### Infrastructure
- **Package Manager**: pnpm (monorepo workspace)
- **Database Container**: Docker & Docker Compose
- **Runtime**: Node.js (v18+)

---

## 📁 Project Structure

### Monorepo Root
```
task-manager/
├── apps/
│   ├── api/                    # NestJS backend
│   └── web/                    # Next.js frontend
├── docker-compose.yml          # PostgreSQL configuration
├── package.json                # Root workspace scripts
├── pnpm-workspace.yaml         # Workspace configuration
├── .env.example                # Environment variables template
└── README.md
```

### API Structure (`apps/api/`)
```
api/
├── prisma/
│   ├── migrations/             # Database migration files
│   ├── schema.prisma           # Database schema definition
│   └── seed.ts                 # Database seeding script
├── src/
│   ├── auth/                   # Authentication module
│   │   ├── decorators/         # Custom decorators (@Public, @CurrentUser)
│   │   ├── dto/                # Data Transfer Objects (Login, Register)
│   │   ├── guards/             # JWT auth guard
│   │   ├── auth.controller.ts  # Auth endpoints (login, register)
│   │   ├── auth.service.ts     # Auth business logic
│   │   └── jwt.strategy.ts     # JWT validation strategy
│   ├── users/                  # Users module
│   │   ├── users.repository.ts # User data access layer
│   │   └── users.module.ts
│   ├── tasks/                  # Tasks module
│   │   ├── dto/                # Task DTOs (Create, Update, Reorder)
│   │   ├── tasks.controller.ts # Task endpoints (CRUD + reorder)
│   │   ├── tasks.service.ts    # Task business logic
│   │   ├── tasks.repository.ts # Task data access layer
│   │   └── tasks.module.ts
│   ├── prisma/                 # Prisma module
│   │   ├── prisma.service.ts   # Prisma client service
│   │   └── prisma.module.ts
│   ├── app.module.ts           # Root application module
│   └── main.ts                 # Application entry point
├── .env.example                # API environment variables
├── package.json                # API dependencies & scripts
└── tsconfig.json
```

### Web Structure (`apps/web/`)
```
web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Dashboard page (protected)
│   │   ├── login/              # Login page
│   │   ├── register/           # Register page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── auth/               # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── dashboard/          # Dashboard components
│   │   │   └── DashboardClient.tsx
│   │   └── kanban/             # Kanban board components
│   │       ├── KanbanBoard.tsx     # Main board with drag & drop
│   │       ├── KanbanColumn.tsx    # Column container
│   │       ├── TaskCard.tsx        # Individual task card
│   │       ├── TaskModal.tsx       # Create/Edit task modal
│   │       └── TaskViewModal.tsx   # View task details
│   ├── lib/
│   │   ├── api/                # API client functions
│   │   │   ├── auth.ts         # Auth API calls
│   │   │   ├── tasks.ts        # Client-side task API
│   │   │   └── server-tasks.ts # Server-side task API
│   │   ├── contexts/           # React contexts
│   │   │   └── AuthContext.tsx # Authentication context
│   │   └── hooks/              # Custom React hooks
│   │       ├── auth/
│   │       │   └── useAuth.ts  # Auth hook
│   │       └── useTasks.ts     # Tasks data fetching hook
│   ├── types/                  # TypeScript type definitions
│   │   ├── auth.ts
│   │   └── task.ts
│   ├── middleware.ts           # Next.js middleware (auth protection)
│   └── ...
├── package.json                # Web dependencies & scripts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher)
- **Docker** and **Docker Compose**

Install pnpm globally if you haven't already:
```bash
npm install -g pnpm
```

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   # Copy root environment file
   cp .env.example .env
   
   # Copy API environment file
   cp apps/api/.env.example apps/api/.env
   ```

3. **Edit the `.env` files with your preferred settings** (optional - defaults work fine)

---

## 🗄️ Database Setup

### Starting the Database

The project uses PostgreSQL running in Docker. Start it with:

```bash
pnpm db:start
```

This command will:
- Pull the PostgreSQL 16 Alpine image (if not already downloaded)
- Create and start a PostgreSQL container on port `5432`
- Create a volume for persistent data storage
- Set up the database with credentials from your `.env` file

**Default database credentials:**
- Host: `localhost`
- Port: `5432`
- Database: `taskmanager`
- User: `taskmanager`
- Password: `taskmanager`

### Complete Database Setup (First Time)

For the first time setup, use this single command that does everything:

```bash
pnpm db:setup
```

This will:
1. Start the PostgreSQL container
2. Generate the Prisma Client
3. Run all pending migrations
4. Create all required tables

---

## 🔄 Database Migrations

### What are Migrations?

Migrations are version-controlled database schema changes. They help you:
- Track database structure changes over time
- Apply consistent changes across environments
- Rollback changes if needed

### Quick Reference

| Command | What it does | When to use |
|---------|-------------|-------------|
| `pnpm db:migrate` | Creates NEW migration (if schema changed) + Applies it | Development: when YOU change the schema |
| `pnpm db:migrate:deploy` | ONLY applies existing migrations | Production/CI or when pulling migrations from Git |

### Development: Create & Apply Migrations

```bash
# Detect schema changes, create migration, and apply it (development)
pnpm db:migrate
```

When you run this command, Prisma will:
1. Detect changes in your `schema.prisma` file
2. Generate SQL migration files (if schema changed)
3. Apply the migration to your database
4. Prompt you to name the migration (if creating new one)

**Creating new migrations workflow:**
1. **Edit the schema** at `apps/api/prisma/schema.prisma`
2. **Create migration:**
   ```bash
   pnpm db:migrate
   ```
3. **Enter a descriptive name** (e.g., "add_priority_to_tasks")

### Production: Apply Existing Migrations Only

To **only apply existing migrations** without creating new ones:

```bash
pnpm db:migrate:deploy
```

This is useful when:
- Deploying to production/staging
- Running in CI/CD pipelines
- You want to apply migrations created by other developers
- You pulled new migrations from Git and just need to apply them

### Other Database Commands

```bash
# View database visually (opens Prisma Studio on localhost:5555)
pnpm db:studio

# Seed database with test data
pnpm db:seed

# Reset database (⚠️ deletes all data and re-runs migrations)
pnpm db:reset

# Stop PostgreSQL container
pnpm db:stop

# View PostgreSQL logs
pnpm db:logs

# Apply existing migrations only (no new migration creation)
pnpm db:migrate:deploy
```

---

## 🎯 Running the Application

### Run Everything at Once

Start the database and both applications (API + Web) simultaneously:

```bash
# First time: Complete setup
pnpm db:setup

# Then: Start both apps in development mode
pnpm dev
```

This will start:
- **NestJS API** on `http://localhost:3001`
- **Next.js Web** on `http://localhost:3000`

Both apps will run with hot-reload enabled.

### Run Applications Individually

If you need to run apps separately:

```bash
# Start only the Next.js frontend
pnpm --filter web dev

# Start only the NestJS backend
pnpm --filter api dev
```

### Build for Production

```bash
# Build all apps
pnpm build

# Or build individually
pnpm --filter web build
pnpm --filter api build
```

---

## 📝 Common Development Workflow

1. **Start your day:**
   ```bash
   pnpm db:start    # Start database
   pnpm dev         # Start both applications
   ```

2. **Make database changes:**
   ```bash
   # Edit apps/api/prisma/schema.prisma
   pnpm db:migrate  # Apply changes
   pnpm db:studio   # View in Prisma Studio
   ```

3. **View data:**
   ```bash
   pnpm db:studio   # Opens GUI on localhost:5555
   ```

4. **Seed test data:**
   ```bash
   pnpm db:seed
   ```

---

## 🔍 Additional Commands

```bash
# Linting
pnpm lint              # Lint all apps
pnpm lint:api          # Lint API only
pnpm lint:web          # Lint Web only

# Formatting (API only)
pnpm format            # Format API code with Prettier

# Database management
pnpm db:format         # Format schema.prisma file
```

---

## 📖 API Endpoints

Once the API is running, you can access:

- **API Base URL**: `http://localhost:3001`
- **Health Check**: `http://localhost:3001/health`

Main endpoints:
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create new task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `POST /tasks/reorder` - Reorder tasks

---

## 🌐 Frontend Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Main dashboard with Kanban board (protected)

---

## 🛠️ Tech Features

- ✅ JWT Authentication with refresh token support
- ✅ Protected routes with middleware
- ✅ Drag & drop Kanban board
- ✅ Real-time task status updates
- ✅ Task creation, editing, and deletion
- ✅ User registration and login
- ✅ Password hashing with bcrypt
- ✅ Form validation
- ✅ TypeScript throughout
- ✅ Responsive design
- ✅ Database migrations with Prisma
- ✅ Monorepo with pnpm workspaces

---

## 📦 Project Info

- **Monorepo Manager**: pnpm workspaces
- **Frontend Port**: 3000
- **Backend Port**: 3001
- **Database Port**: 5432
- **Prisma Studio Port**: 5555

---

## 🤝 Contributing

1. Make your changes
2. Run `pnpm lint` to check for linting errors
3. Test your changes locally
4. Commit and push

---

## 📄 License

Private project - All rights reserved
