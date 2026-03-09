# Medilearn (Kunterbunt) - Project Context

Medilearn is a medical learning platform designed for students to study subjects through topics, multiple-choice questions (exams), and flashcards. The project is structured as a TypeScript monorepo using `npm` workspaces.

## Project Overview

- **Architecture:** Monorepo with three main packages:
  - `packages/backend`: Express-based API server.
  - `packages/frontend`: React SPA built with Vite and Tailwind CSS.
  - `packages/shared`: Shared types and validation logic (Zod).
- **Main Technologies:**
  - **Backend:** Node.js, Express, Prisma (ORM), SQLite, TypeScript, Zod.
  - **Frontend:** React, Vite, TypeScript, React Router, Tailwind CSS (v4), Framer Motion, Lucide Icons.
  - **Database:** SQLite (file-based).

## Key Features

- **Subjects:** High-level categories (e.g., Kardiologie, Chirurgie).
- **Topics:** Detailed learning summaries (Markdown support).
- **Questions:** Multiple-choice questions for exam simulation.
- **Flashcards:** Spaced repetition-based study cards (SM-2 algorithm).
- **Exam Mode:** Practice exams with session tracking and results.
- **Data Import:** Ability to import content dynamically.

## Building and Running

### Prerequisites

- Node.js (Latest LTS recommended)
- npm

### Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Database Migration:**
    Initialize the SQLite database and run migrations.
    ```bash
    npm run db:migrate
    ```

3.  **Seed Data (Optional):**
    Populate the database with initial learning content.
    ```bash
    npm run db:seed
    ```

### Development

- **Run All (Backend + Frontend):**
  ```bash
  npm run dev
  ```
  This uses `concurrently` to start both the Vite dev server and the Express backend (with `tsx watch`).

- **Individual Packages:**
  - Backend: `npm run dev:backend`
  - Frontend: `npm run dev:frontend`

### Production Build

```bash
npm run build
```

## Directory Structure

```text
/
├── packages/
│   ├── backend/          # Express API, Prisma schema, migrations
│   │   ├── prisma/       # Database schema and seed script
│   │   └── src/          # API routes, middleware, services
│   ├── frontend/         # React/Vite application
│   │   ├── src/
│   │   │   ├── api/      # Fetch client
│   │   │   ├── components/ # Shared UI components
│   │   │   ├── hooks/    # Custom React hooks for data fetching
│   │   │   └── pages/    # Main application views
│   └── shared/           # Common TypeScript types and Zod schemas
└── package.json          # Root workspace configuration
```

## Development Conventions

- **TypeScript:** Strict typing is preferred. Use types from `@medilearn/shared` whenever possible to ensure consistency between frontend and backend.
- **API Communication:** The frontend uses a custom `apiRequest` utility in `packages/frontend/src/api/client.ts`. API routes are prefixed with `/api`.
- **Styling:** Tailwind CSS is used for styling. Prefer utility classes and follow the established color palette defined in the database/metadata.
- **Database:** Managed via Prisma. Always run `npx prisma generate` after modifying `schema.prisma`.
- **Routing:** React Router (v7) is used for frontend navigation.
