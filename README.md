# HFC Connect Hub

This repository contains the HFC organization web application stack:

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeORM + MySQL

## Project Structure

- `admineditdelet/` — admin dashboard and management portal
- `hfc_client/` — public-facing React client
- `backtypeorm/` — Node.js API server and database layer

## Active Architecture

The current project architecture is:

- Frontend apps are React + TypeScript projects built with Vite.
- The backend in `backtypeorm/` is a JavaScript/Node.js service using Express and TypeORM.
- The database layer is MySQL.
- Authentication uses JWT and admin-only routes are enforced server-side.

This repo is not a TypeScript backend project. The backend is implemented in JavaScript, not TypeScript.

## Quick Start

### Backend

```bash
cd backtypeorm
npm install
copy .env.example .env
npm run dev
```

### Frontend

```bash
cd admineditdelet
npm install
npm run dev
```

Or for the public client:

```bash
cd hfc_client
npm install
npm run dev
```

## Notes

- Local environment files such as `.env` and `node_modules` are intentionally ignored by Git.
- The repository should keep secrets out of source control and only use `.env.example` as a template.
- The older docs in this repo are historical/internal notes and should be treated as supporting material, not as the canonical project architecture.
