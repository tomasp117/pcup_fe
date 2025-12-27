# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite frontend application for a tournament management system (PCUP). The application handles tournament organization, match reporting, team management, and playoff brackets. It uses role-based authentication with JWT tokens.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with HMR on localhost:5173
- `npm run build` - TypeScript compile + Vite production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

### Development Server Configuration
The dev server runs on `localhost:5173` with CORS enabled. For development with ngrok or similar tunneling, see commented configuration in `vite.config.ts`.

## Architecture

### Tech Stack
- **React 19** with **TypeScript**
- **Vite** for build tooling
- **React Router 7** for routing
- **TanStack Query (React Query)** for server state management
- **shadcn/ui** components (New York style) with **Radix UI** primitives
- **Tailwind CSS** for styling
- **React DnD** for drag-and-drop functionality
- **React Toastify** for notifications

### Project Structure

```
src/
├── components/          # UI components organized by feature
│   ├── ui/             # shadcn/ui base components
│   ├── Category/       # Category-specific components
│   ├── HomePage/       # Homepage cards and sections
│   ├── MatchReport/    # Match reporting workflow components
│   │   ├── MatchInfo/
│   │   ├── MatchLog/
│   │   └── MatchTeamTable/
│   ├── MatchDraws/     # Team drawing and grouping
│   └── Timetable/      # Scheduling and playoff brackets
├── pages/              # Route page components
├── hooks/              # Custom React hooks for API calls
│   ├── MatchReport/    # Match-specific hooks
│   ├── Draws/          # Drawing and grouping hooks
│   └── MyTeam/         # Team management hooks
├── interfaces/         # TypeScript type definitions
├── Contexts/           # React Context providers
│   ├── UserContext.tsx          # Authentication and user state
│   ├── TournamentEditionContext.tsx
│   └── MatchReportContext/
├── layouts/            # Layout components
├── styles/             # Global CSS
├── routes.tsx          # React Router configuration
└── main.tsx           # Application entry point
```

### Key Architectural Patterns

#### API Integration
All API calls use TanStack Query (React Query) through custom hooks:
- **Query hooks**: `useTournaments()`, `useCategories()`, `useMatches()`, etc.
- **Mutation hooks**: `useCreateTournament()`, `useUpdateMatch()`, etc.
- API URL configured via `VITE_API_URL` environment variable
- JWT token stored in localStorage, included in Authorization header
- Query invalidation on mutations for cache consistency

**Hook pattern example** (see `src/hooks/useTournaments.ts`):
```typescript
export const useTournaments = () => {
  return useQuery<Tournament[]>({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/tournaments`);
      if (!res.ok) throw new Error("...");
      return res.json();
    },
  });
};
```

#### Authentication & Authorization
- JWT token authentication with role-based access control
- User roles: `Admin`, `Recorder`, `Coach`, `ClubAdmin`, `Referee`
- `UserContext` provides global user state and logout functionality
- `ProtectedRoute` wrapper component enforces role-based route access
- Token expiration checked on app initialization (see `App.tsx`)
- Token payload decoded with Base64URL handling for UTF-8 characters

#### Routing
React Router with dynamic edition-based routing:
- Base path: `/:edition?` - All routes support optional tournament edition parameter
- Protected routes wrapped with `<ProtectedRoute allowedRoles={[...]}>`
- Route loaders used for data prefetching (e.g., match details)

#### State Management
- **Server state**: TanStack Query with QueryClient
- **User auth**: UserContext (React Context)
- **Tournament edition**: TournamentEditionContext
- **Match reporting**: MatchReportContext for match-specific state

#### UI Components
- shadcn/ui components in `src/components/ui/`
- Configuration in `components.json` with "@" path aliases
- Custom toast notifications via `showToast()` utility
- Tailwind with custom color scheme (primary: blue, secondary: dark gray)

### Domain-Specific Features

#### Match Reporting Workflow
Complex multi-step process for recording match events:
1. **Match Selection** (`MatchSelector.tsx`) - Choose match to report
2. **Match Info** - Team lineups, scores, timers
3. **Match Log** - Real-time event recording
4. **Match Team Tables** - Player statistics with event handlers
   - GoalHandlers, RedCardHandlers, YellowCardHandlers, TwoMinuteHandlers
5. **Match Preview** - Review before submission

Custom hooks for match reporting:
- `useEvent` - Event creation/management
- `useMatchTimer` - Match clock with penalty time tracking
- `usePenaltyTimer` - 2-minute penalty countdown
- `useReconstructStats` - Rebuild stats from events

#### Team Draws & Groups
React DnD implementation for team organization:
- `DraggableTeam` + `DroppableGroup` components
- `GroupVariants` for different group configurations
- `TimeTable` for match scheduling
- Integration with category data via `useCategoryData` hook

#### Playoff Brackets
Playoff bracket editor and visualizer:
- `PlayoffBracketEditor` for admin configuration
- `PlayoffBracketPage` for public viewing
- Drag-and-drop team placement

## Environment Variables

Required in `.env`:
```
VITE_API_URL=http://localhost:5056/api
VITE_API_URL_IMAGES=http://localhost:5056/images
VITE_GOOGLE_MAPS_API_KEY=...
```

## Docker Deployment

Multi-stage Dockerfile:
1. Node 20 Alpine - Build React/Vite app
2. Nginx Alpine - Serve static files

Build: `docker build -t pcup-frontend .`

See `dockerfile` and `nginx.conf` for configuration.

## Important Conventions

### Path Aliases
TypeScript path aliases configured in `tsconfig.json` and `vite.config.ts`:
- `@/` → `src/`
- Use for all internal imports: `import { showToast } from "@/components/ui/showToast"`

### TypeScript Interfaces
36 interface files in `src/interfaces/` organized by domain:
- `MatchReport/` - Match, Team, Event, Lineup, Person roles
- `CategoryData/` - Category and group structures
- `Draws/` - Team draws and variants
- `Timetable/` - Scheduling DTOs
- `BracketEditor/` - Playoff bracket types

### API Error Handling
- Mutations throw errors with response text
- Queries show error state via React Query
- Toast notifications for user feedback via `showToast()`

### Role-Based Features
When adding new features requiring authentication:
1. Wrap route in `<ProtectedRoute allowedRoles={[...]}>`
2. Include Authorization header in API calls
3. Check user role in UserContext where needed

### shadcn/ui Components
To add new shadcn components, use the CLI or manually place in `src/components/ui/`. Configuration is in `components.json` with "new-york" style preset.
