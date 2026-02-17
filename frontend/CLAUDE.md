# Frontend Guidelines

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui (Radix UI primitives)
- next-themes (dark/light/system mode)
- sonner (toast notifications)
- lucide-react (icons)
- Better Auth (JWT)

## Project Structure
```
frontend/
├── app/
│   ├── globals.css          # CSS variables for light/dark themes
│   ├── layout.tsx           # ThemeProvider + Toaster + Inter font
│   ├── page.tsx             # Hero landing page
│   ├── auth/
│   │   ├── signin/page.tsx  # Sign in with shadcn Card form
│   │   └── signup/page.tsx  # Sign up with shadcn Card form
│   ├── api/auth/            # Auth API routes
│   └── dashboard/
│       └── page.tsx         # Main dashboard (Navbar + Tabs + search + dialogs)
├── components/
│   ├── ui/                  # shadcn/ui primitives (DO NOT edit manually)
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   └── tooltip.tsx
│   ├── AISummary.tsx        # AI summary card with stats badges
│   ├── DeleteConfirmDialog.tsx  # AlertDialog for delete confirmation
│   ├── EmptyState.tsx       # Reusable empty state (icon + title + description)
│   ├── Navbar.tsx           # Sticky nav: logo, search (Ctrl+K), theme toggle, user dropdown
│   ├── SmartTaskForm.tsx    # AI-powered task input with parse preview
│   ├── Suggestions.tsx      # AI task suggestions in cards
│   ├── TaskEditDialog.tsx   # Dialog for editing task details
│   ├── TaskItem.tsx         # Task card with checkbox, badges, edit/delete buttons
│   ├── TaskList.tsx         # Task list with empty state handling
│   ├── TaskSkeleton.tsx     # Loading skeleton cards
│   └── ThemeToggle.tsx      # Sun/Moon/Monitor theme cycle button
├── lib/
│   ├── api.ts               # Backend API client
│   ├── auth.ts              # Server-side auth (JWT, bcrypt, pg)
│   ├── auth-client.ts       # Client-side auth (useSession, signIn, signOut)
│   └── utils.ts             # cn() helper (clsx + tailwind-merge)
├── components.json          # shadcn/ui configuration
├── tailwind.config.ts       # Tailwind with shadcn CSS variable theme + darkMode
├── package.json
└── CLAUDE.md
```

## Patterns
- Use server components by default
- Client components only when needed (interactivity) — marked with `"use client"`
- API calls go through `/lib/api.ts`
- Use shadcn/ui components from `@/components/ui/` — never raw HTML elements for forms/buttons
- Use `cn()` from `@/lib/utils` for conditional class merging
- Use `toast` from `sonner` for user feedback (success, error)
- Use lucide-react icons — import individually (e.g., `import { Pencil } from "lucide-react"`)

## Component Structure
- `/components/ui/` — shadcn/ui primitives (auto-generated, do not edit manually)
- `/components/` — App-specific components built on top of shadcn/ui
- `/app/` — Pages and layouts

## Adding shadcn Components
```bash
npx shadcn@latest add <component-name>
```

## API Client
All backend calls should use the api client:
```typescript
import { api } from '@/lib/api'
const tasks = await api.getTasks()
```

## Authentication
- Better Auth handles sign in/sign up
- JWT token stored and sent with API requests
- Protected routes redirect to signin

## Styling
- Use shadcn/ui components as building blocks
- Use Tailwind CSS utility classes for layout and spacing
- Use CSS variables for theming (defined in `globals.css`)
- `darkMode: ["class"]` — theme controlled by next-themes
- No inline styles

## Running
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables
```
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key
DATABASE_URL=postgresql://...
```
