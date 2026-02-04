# Frontend Guidelines

## Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Better Auth

## Project Structure
```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   └── dashboard/
│       └── page.tsx
├── components/
│   ├── TaskList.tsx
│   ├── TaskForm.tsx
│   └── TaskItem.tsx
├── lib/
│   ├── api.ts
│   └── auth.ts
├── package.json
└── CLAUDE.md
```

## Patterns
- Use server components by default
- Client components only when needed (interactivity)
- API calls go through `/lib/api.ts`

## Component Structure
- `/components` - Reusable UI components
- `/app` - Pages and layouts

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
- Use Tailwind CSS classes
- No inline styles
- Follow existing component patterns

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
