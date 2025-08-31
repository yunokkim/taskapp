# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a persona-based schedule planning web application built for Kim Yun-ok, featuring role-based schedule management across different personas (journalist, mother, researcher, developer, investor).

## Development Commands

### Frontend Development (in /frontend directory)
- `npm run dev` - Start development server with Turbopack on port 3000
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database Operations
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema to database
- `npx prisma migrate dev` - Create and apply migration
- `npx prisma studio` - Open Prisma Studio

### Supabase (root directory)
- `npx supabase start` - Start local Supabase
- `npx supabase stop` - Stop local Supabase

## Architecture

### Tech Stack
- **Frontend**: Next.js 15.4.6 with App Router, React 19, TypeScript
- **Styling**: TailwindCSS 4 + shadcn/ui components
- **Calendar**: FullCalendar.js for calendar views
- **State Management**: Zustand stores for events and personas
- **Database**: Supabase (PostgreSQL) with Prisma ORM
- **Forms**: React Hook Form for event creation/editing

### Project Structure
- **Frontend App**: `/frontend/` - Main Next.js application
- **API Routes**: `/frontend/src/app/api/` - Next.js API endpoints
- **Components**: `/frontend/src/components/` - Organized by feature
  - `layout/` - Header, Sidebar, Footer, MainLayout
  - `event/` - Event forms, lists, and modals
  - `persona/` - Persona management components
  - `calendar/` - FullCalendar integration
  - `ui/` - shadcn/ui base components
- **State**: `/frontend/src/store/` - Zustand stores
- **Types**: `/frontend/src/types/` - TypeScript definitions
- **Utils**: `/frontend/src/utils/` - Date utilities, constants, timezone handling

### Data Models (Prisma)
- **Persona**: id, name, color, description, events[]
- **Event**: id, title, description, start, end, personaId, tags[], repeat, notifications[]
- **NotificationSetting**: id, eventId, type (EMAIL/PUSH), minutesBefore

### API Structure
- **Events**: `/api/events` - CRUD operations with filtering
- **Personas**: `/api/personas` - Persona management
- **Stock**: `/api/stock` - Stock market data widget

### State Management
- **Event Store** (`eventStore.ts`): Manages events with CRUD operations, filtering, and date range queries
- **Persona Store** (`personaStore.ts`): Manages personas with full CRUD operations

### Key Features
- Persona-based color coding and filtering
- Calendar views (month/week/day) with drag-and-drop
- Korean timezone handling and date formatting
- Stock market widget integration
- Real-time event management with optimistic updates

### Environment Variables Required
- `DATABASE_URL` - Supabase database connection
- `DIRECT_URL` - Direct database connection
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Important Notes
- Uses Korean locale and Asia/Seoul timezone
- Font: Pretendard (Korean web font)
- Path alias: `@/*` maps to `./src/*`
- Database operations use both Prisma and Supabase clients
- Event dates are stored in UTC but displayed in Korean timezone