# SDMastery — Frontend CLAUDE.md

> This file is the Claude Code context for the Vite + React frontend.
> Read this file AND `../CONSTITUTION.md` at the start of every session.

---

## Project

SDMastery frontend — Vite + React 18 + TypeScript SPA.

**Root:** `FrontEnd/` (this directory)
**Planning files:** `../` (project root)
**Backend API:** `http://localhost:8000/api/v1`

---

## Quick Reference

### Run the stack
```bash
# Dev server
npm run dev        # http://localhost:5174

# Tests
npm run test
npm run test -- --watch
npm run test -- ChatPage

# Build
npm run build
npm run preview

# Type check
npx tsc --noEmit
```

### Key directories
```
src/
  api/               ← All API modules (auth.api.ts, topics.api.ts, etc.)
  components/        ← Reusable components
    auth/            ← EmailVerificationBanner, etc.
    topics/          ← TopicCard, TopicDetail
    attempt/         ← AnswerForm, EvaluationResult, AttemptHistory
    chat/            ← MessageList, ChatInput, AttemptSelector
    badges/          ← BadgeCard, BadgeGroup
    analytics/       ← charts, calendar, widgets
    streak/          ← StreakWidget
    ui/              ← generic: Button, Card, Toast, Modal, Spinner
  hooks/             ← Custom React hooks (useTopics, useChatSession, etc.)
  pages/             ← Page-level components (one per route)
  store/             ← Zustand stores (useAuthStore.ts)
  types/             ← TypeScript types (index.ts)
  config/            ← Constants (PASS_THRESHOLD, AGENT_LIST, etc.)
  router.tsx         ← createBrowserRouter setup
  api/client.ts      ← Axios instance with interceptors
  main.tsx           ← App entry
```

---

## Core Patterns

### Data fetching — always TanStack Query
```tsx
// In a hook:
export function useTopics() {
  return useQuery({
    queryKey: ['topics'],
    queryFn: () => topicsApi.getTopics(),
    staleTime: 5 * 60 * 1000,
  });
}

// In a component:
const { data: topics, isLoading, error } = useTopics();
```

### Mutations
```tsx
const mutation = useMutation({
  mutationFn: (answer: string) => attemptsApi.submitAttempt(slug, answer),
  onSuccess: (data) => { /* transition to polling */ },
  onError: (err) => { /* show toast */ },
});
```

### Auth store access
```tsx
const { user, token, setAuth, clearAuth } = useAuthStore();
```

### API calls — never in components directly
All API calls go through `src/api/*.api.ts` modules, never raw `fetch` or `axios` in components.

---

## TypeScript Rules

- No `any` — always type properly
- All API response shapes typed in `src/types/index.ts`
- Props interfaces defined above each component
- `React.FC<Props>` or explicit return type

---

## Styling

- TailwindCSS only — no inline styles, no CSS modules
- Dark-first: default dark bg (`bg-zinc-900`), light text (`text-zinc-100`)
- Accent color: indigo (`indigo-500`, `indigo-600`)
- Success: green, Warning: amber, Error: red
- Consistent spacing: use Tailwind's spacing scale

---

## Test Patterns

```tsx
// Mock API module
vi.mock('@/api/topics.api', () => ({
  getTopics: vi.fn().mockResolvedValue(mockTopics),
}));

// Render with providers
const renderWithProviders = (ui: ReactElement) => {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

// Assert
expect(screen.getByText('Caching Overview')).toBeInTheDocument();
await waitFor(() => expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled());
```

---

## Current Phase

Update this line when starting a phase:
**Active phase:** FE-1 Foundation

**Branch:** phase/fe-1-foundation

---

## Phase Checklist Before Merge

- [ ] All new components have tests
- [ ] No `console.log` in committed code
- [ ] No `any` TypeScript types
- [ ] All routes are tested (navigation works)
- [ ] Loading states handled (skeletons or spinners)
- [ ] Error states handled (empty states, error messages)
- [ ] Mobile responsive (check at 375px and 1280px)
- [ ] Accessibility: buttons have labels, inputs have labels, no color-only info
