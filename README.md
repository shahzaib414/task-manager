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

Install pnpm if you haven't already:
```bash
npm install -g pnpm
```

### Installation

Install all dependencies:
```bash
pnpm install
```

### Development

Run both apps in development mode:
```bash
pnpm dev
```

Or run them individually:

**Next.js app (port 3000):**
```bash
pnpm dev:web
```

**NestJS API (port 3001):**
```bash
pnpm dev:api
```

### Build

Build all apps:
```bash
pnpm build
```

Or build individually:
```bash
pnpm build:web
pnpm build:api
```

## Apps

### Web (Next.js)
- **Location:** `apps/web`
- **Port:** 3000
- **Tech:** Next.js 14, React 18, TypeScript

### API (NestJS)
- **Location:** `apps/api`
- **Port:** 3001
- **Tech:** NestJS 10, TypeScript
