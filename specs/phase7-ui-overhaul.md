# Phase VII Spec: UI/UX Overhaul with shadcn/ui

**Status: COMPLETED**

## Overview
Transform the basic Tailwind CSS interface into a polished, modern, production-quality UI using **shadcn/ui** (Radix UI + Tailwind). Add dark mode, toast notifications, loading skeletons, keyboard shortcuts, search/filter, and responsive mobile design. No backend changes required — this phase is frontend-only.

## Goals
- Replace raw Tailwind markup with shadcn/ui components for a consistent design system
- Add dark/light mode toggle with system preference detection
- Improve task management UX with inline editing, search, and keyboard shortcuts
- Add toast notifications for all user actions (create, delete, complete, errors)
- Add loading skeletons instead of plain "Loading..." text
- Make the app fully responsive for mobile devices
- Add animated transitions for task state changes

## Architecture

```
Frontend (Next.js + shadcn/ui)
├── components/ui/          # shadcn/ui primitives (button, card, input, etc.)
├── components/             # App components using shadcn/ui
├── lib/utils.ts            # cn() utility for Tailwind class merging
├── app/globals.css         # CSS variables for theming (light/dark)
└── app/layout.tsx          # ThemeProvider wrapper
```

No backend or API changes. All modifications are in `frontend/`.

## Technology Additions

| Package | Purpose |
|---------|---------|
| `shadcn/ui` | Component library (CLI adds individual components) |
| `@radix-ui/*` | Headless UI primitives (installed by shadcn) |
| `class-variance-authority` | Component variant styling |
| `clsx` + `tailwind-merge` | Conditional class merging (`cn()` utility) |
| `lucide-react` | Icon library |
| `next-themes` | Dark/light mode with SSR support |
| `sonner` | Toast notification library (shadcn-compatible) |

## Setup Steps

### 1. Initialize shadcn/ui

Run `npx shadcn@latest init` in the `frontend/` directory with these options:

| Option | Value |
|--------|-------|
| Style | Default |
| Base color | Slate |
| CSS variables | Yes |
| Tailwind CSS config | `tailwind.config.js` |
| Components alias | `@/components` |
| Utils alias | `@/lib/utils` |

This creates:
- `lib/utils.ts` with the `cn()` helper
- `components/ui/` directory
- Updates `globals.css` with CSS variables for light/dark themes
- Creates `components.json` config file

### 2. Install shadcn Components

Add these components via CLI (`npx shadcn@latest add <name>`):

| Component | Used For |
|-----------|----------|
| `button` | All buttons (sign in, sign out, create, delete, filter) |
| `card` | Task cards, summary card, suggestion cards |
| `input` | Text inputs (task title, search bar) |
| `textarea` | Task description |
| `label` | Form labels |
| `badge` | Priority badges, category tags, task status |
| `dialog` | Task edit modal, delete confirmation |
| `dropdown-menu` | User menu (sign out, theme toggle) |
| `skeleton` | Loading placeholders |
| `toast` / `sonner` | Action notifications |
| `separator` | Visual dividers |
| `avatar` | User avatar in header |
| `tooltip` | Icon button hints |
| `switch` | Theme toggle |
| `select` | Priority selector, filter selector |
| `tabs` | All/Pending/Completed filter tabs |
| `command` | Keyboard shortcut command palette (Ctrl+K) |
| `checkbox` | Task completion toggle |
| `alert` | Error messages |

### 3. Install next-themes

For dark/light mode:
```bash
npm install next-themes
```

## Component Redesign

### Layout — `app/layout.tsx`

Wrap the app with `ThemeProvider` from `next-themes`:

```tsx
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Header / Navbar — New `components/Navbar.tsx`

A sticky top navbar with:
- App logo/name on the left ("Todo AI")
- Search input in the center (filters tasks client-side)
- Theme toggle (sun/moon icon) using `next-themes`
- User avatar + dropdown menu (email, sign out) on the right
- Keyboard shortcut hint: `Ctrl+K` to focus search

```
┌─────────────────────────────────────────────────────┐
│  ✓ Todo AI     [🔍 Search tasks... Ctrl+K]   🌙 👤 │
└─────────────────────────────────────────────────────┘
```

### Dashboard — `app/dashboard/page.tsx`

Restructure the dashboard layout:

```
┌────────────────────────────────────────────┐
│ Navbar                                     │
├────────────────────────────────────────────┤
│                                            │
│  ┌─ AI Summary Card ───────────────────┐   │
│  │ "You have 5 tasks, 2 due today..." │   │
│  └─────────────────────────────────────┘   │
│                                            │
│  ┌─ Smart Task Input ─────────────────┐   │
│  │ "Buy groceries tomorrow at 5pm..." │   │
│  │ [Add Task]                          │   │
│  └─────────────────────────────────────┘   │
│                                            │
│  ┌─ Tabs: All | Pending | Completed ──┐   │
│  │                                     │   │
│  │  ☐ Task 1  [high] [work]  •••     │   │
│  │  ☑ Task 2  [low]  [personal] •••  │   │
│  │  ☐ Task 3  [med]  [shopping] •••  │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                            │
│  ┌─ AI Suggestions ───────────────────┐   │
│  │ 💡 "Review meeting notes"  [Add]   │   │
│  │ 💡 "Follow up with John"   [Add]   │   │
│  └─────────────────────────────────────┘   │
│                                            │
└────────────────────────────────────────────┘
```

### Task Item — `components/TaskItem.tsx`

Redesign each task as a Card:

```
┌─────────────────────────────────────────────┐
│ ☐  Buy groceries                            │
│    Get milk, eggs, and bread                │
│    📅 Tomorrow 5:00 PM                       │
│    [🔴 High]  [🏷 Shopping]  [🏷 Personal]    │
│                               [✏️] [🗑️]     │
└─────────────────────────────────────────────┘
```

Elements:
- **Checkbox**: shadcn `Checkbox` for completion toggle
- **Title**: Bold, with strikethrough when completed
- **Description**: Muted text below title (truncated to 2 lines)
- **Due date**: Calendar icon + formatted date with `Badge` variant
- **Priority**: Color-coded `Badge` (red=high, yellow=medium, green=low)
- **Categories**: Array of `Badge` components with outline variant
- **Actions**: Icon buttons (edit pencil, delete trash) with `Tooltip`
- **Completed state**: Reduced opacity, strikethrough title

### Task Edit Dialog — New `components/TaskEditDialog.tsx`

A `Dialog` that opens when clicking the edit icon:

- Title input
- Description textarea
- Priority `Select` dropdown (low/medium/high)
- Due date input
- Categories as comma-separated input or multi-select
- Save / Cancel buttons
- Calls `PUT /api/tasks/{id}` on save

### Delete Confirmation — New `components/DeleteConfirmDialog.tsx`

An `AlertDialog` before deleting:

```
┌──────────────────────────────────────┐
│  Delete task?                        │
│                                      │
│  "Buy groceries" will be             │
│  permanently deleted.                │
│                                      │
│              [Cancel]  [Delete]      │
└──────────────────────────────────────┘
```

### Smart Task Form — `components/SmartTaskForm.tsx`

Redesign using shadcn components:

- `Input` with placeholder "Type a task naturally... e.g. 'Meeting with John tomorrow at 3pm'"
- `Button` with loading spinner during AI parse
- Show parsed result in a `Card` preview before confirming creation
- Success `toast` on creation

### AI Summary — `components/AISummary.tsx`

- Wrap in a shadcn `Card` with gradient border or accent background
- Loading state uses `Skeleton` components
- Sparkle icon (✨) in the header
- Stats displayed as small `Badge` elements (total, completed, pending, overdue)

### Suggestions — `components/Suggestions.tsx`

- Each suggestion in a small `Card` with an "Add" `Button`
- Lightbulb icon (💡) prefix
- Success `toast` on accept

### Auth Pages — `app/auth/signin/page.tsx` & `signup/page.tsx`

Redesign with shadcn:

```
┌──────────────────────────────────────┐
│                                      │
│         ✓ Todo AI                    │
│                                      │
│  ┌─ Card ──────────────────────┐    │
│  │  Sign In                     │    │
│  │                              │    │
│  │  Email                       │    │
│  │  [________________]          │    │
│  │                              │    │
│  │  Password                    │    │
│  │  [________________]          │    │
│  │                              │    │
│  │  [    Sign In     ]          │    │
│  │                              │    │
│  │  Don't have an account?      │    │
│  │  Sign up →                   │    │
│  └──────────────────────────────┘    │
│                                      │
└──────────────────────────────────────┘
```

### Landing Page — `app/page.tsx`

Redesign the root page as a simple landing/hero:

```
┌──────────────────────────────────────┐
│ ✓ Todo AI              [Sign In]    │
├──────────────────────────────────────┤
│                                      │
│    Manage your tasks with AI         │
│    Smart parsing, suggestions,       │
│    and daily summaries.              │
│                                      │
│    [Get Started →]                   │
│                                      │
└──────────────────────────────────────┘
```

## Dark Mode

### CSS Variables

shadcn/ui uses CSS variables for theming. `globals.css` will define:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --primary: 222.2 47.4% 11.2%;
  /* ... full set from shadcn init */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --primary: 210 40% 98%;
  /* ... full dark set */
}
```

### Theme Toggle

A button in the Navbar that cycles: System → Light → Dark.
- Sun icon for light mode
- Moon icon for dark mode
- Laptop icon for system

## Toast Notifications

Use `sonner` (shadcn-compatible) for all action feedback:

| Action | Toast |
|--------|-------|
| Task created | ✓ "Task created successfully" |
| Task updated | ✓ "Task updated" |
| Task completed | ✓ "Task marked as complete" |
| Task uncompleted | "Task marked as pending" |
| Task deleted | ✓ "Task deleted" with Undo action |
| AI parse success | ✓ "Task parsed from natural language" |
| Suggestion accepted | ✓ "Suggestion added as task" |
| Sign in success | ✓ "Welcome back!" |
| Sign out | "Signed out successfully" |
| Error (any) | ✗ Error message in red/destructive style |

## Loading States

Replace all "Loading..." text with `Skeleton` components:

### Task List Skeleton
```
┌─────────────────────────────────────┐
│ ▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓                │
│     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓          │
│     [▓▓▓▓]  [▓▓▓▓▓▓]              │
└─────────────────────────────────────┘
```
Show 3 skeleton cards while tasks are loading.

### AI Summary Skeleton
```
┌─────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓                      │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓      │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              │
└─────────────────────────────────────┘
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `Cmd+K` | Focus search / open command palette |
| `N` | Focus new task input (when not in a text field) |
| `Escape` | Close dialog/modal |

## Responsive Design

### Breakpoints

| Breakpoint | Layout |
|------------|--------|
| `sm` (640px+) | Single column, compact cards |
| `md` (768px+) | Wider cards, navbar search visible |
| `lg` (1024px+) | Full layout, max-width container |

### Mobile Adaptations
- Hamburger menu for navbar on small screens (or bottom sheet)
- Search moves to a expandable icon on mobile
- Task actions accessible via swipe or long-press menu
- Full-width cards with no horizontal padding
- Filter tabs scroll horizontally if needed

## Empty States

Show friendly empty states instead of blank space:

### No Tasks
```
┌─────────────────────────────────────┐
│                                      │
│         📝                           │
│    No tasks yet                      │
│    Create your first task above      │
│                                      │
└─────────────────────────────────────┘
```

### No Search Results
```
┌─────────────────────────────────────┐
│                                      │
│         🔍                           │
│    No tasks match "query"            │
│    Try a different search term       │
│                                      │
└─────────────────────────────────────┘
```

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `components.json` | Create | shadcn/ui configuration |
| `lib/utils.ts` | Create | `cn()` class merge utility |
| `components/ui/*.tsx` | Create | shadcn/ui primitive components |
| `app/globals.css` | Modify | Add CSS variables for light/dark themes |
| `app/layout.tsx` | Modify | Add ThemeProvider + Toaster |
| `app/page.tsx` | Modify | Redesign landing page |
| `app/auth/signin/page.tsx` | Modify | Redesign with shadcn components |
| `app/auth/signup/page.tsx` | Modify | Redesign with shadcn components |
| `app/dashboard/page.tsx` | Modify | Add Navbar, search, restructure layout |
| `components/Navbar.tsx` | Create | App header with search + theme + user menu |
| `components/TaskList.tsx` | Modify | Use Card, Checkbox, Badge components |
| `components/TaskItem.tsx` | Modify | Full Card redesign with actions |
| `components/TaskEditDialog.tsx` | Create | Edit task modal |
| `components/DeleteConfirmDialog.tsx` | Create | Delete confirmation dialog |
| `components/SmartTaskForm.tsx` | Modify | Use shadcn Input, Button, Card |
| `components/AISummary.tsx` | Modify | Use Card, Skeleton, Badge |
| `components/Suggestions.tsx` | Modify | Use Card, Button with icons |
| `components/EmptyState.tsx` | Create | Reusable empty state component |
| `components/TaskSkeleton.tsx` | Create | Skeleton loading for task cards |
| `components/ThemeToggle.tsx` | Create | Dark/light/system mode toggle |
| `tailwind.config.js` | Modify | Extend with shadcn/ui theme config |
| `package.json` | Modify | New dependencies added |

## CI/CD Impact

- **Frontend Lint**: No changes needed — ESLint config already handles `.tsx` files
- **Frontend Build**: No changes needed — `npm run build` will compile new components
- **Docker Build**: No changes needed — same build process

## Success Criteria

1. ~~All pages use shadcn/ui components — no raw HTML buttons, inputs, or cards~~ ✅
2. ~~Dark mode toggle works and persists preference across sessions~~ ✅
3. ~~Toast notifications appear for all create/update/delete/error actions~~ ✅
4. ~~Loading skeletons render during data fetches (no "Loading..." text)~~ ✅
5. ~~Task edit dialog opens, saves changes, and closes with toast~~ ✅
6. ~~Delete confirmation dialog prevents accidental deletion~~ ✅
7. ~~Search bar filters tasks by title in real-time~~ ✅
8. ~~`Ctrl+K` focuses the search bar~~ ✅
9. Mobile layout is responsive (not fully tested on 375px)
10. ~~All existing functionality (auth, CRUD, AI features) works unchanged~~ ✅
11. ~~CI pipeline (lint + build) passes with the new components~~ ✅
12. ~~Empty states display when no tasks or no search results~~ ✅

## Completion Notes

- **Completed:** 2026-02-17
- **Commits:** `9dae7a2` (main implementation), `544800b` (frontend CLAUDE.md), `af1bedb` (project CLAUDE.md), `ad400d6` (constitution.md)
- **CI:** All 5 jobs pass (Frontend Lint, Frontend Build, Backend Tests, Backend Lint, Docker Build)
- **Vercel:** Deployed and verified at https://frontend-seven-rho-73.vercel.app
- **Backend:** Unchanged, healthy at https://backend-theta-eight-41.vercel.app
- **E2E verified:** Sign up, sign in, task CRUD, AI parse, AI summary, AI suggestions, toggle complete, delete — all working
