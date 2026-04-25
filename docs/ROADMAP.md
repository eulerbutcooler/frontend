# AeroMentor — Next.js Frontend Implementation Roadmap

> **Single-source implementation guide** for the Next.js frontend (`web/` in `tree.md`).
> Every section maps 1-to-1 with a phase and references exact file paths from `tree.md`.

---

## Table of Contents

1. [Technology Stack & Versions](#1-technology-stack--versions)
2. [Phase 1 — Foundation & Project Setup](#2-phase-1--foundation--project-setup)
3. [Phase 2 — Design System & Shared Components](#3-phase-2--design-system--shared-components)
4. [Phase 3 — Authentication (Auth.js v5)](#4-phase-3--authentication-authjs-v5)
5. [Phase 4 — API Layer & Data Fetching](#5-phase-4--api-layer--data-fetching)
6. [Phase 5 — Layout Shell (Sidebar + Topbar)](#6-phase-5--layout-shell-sidebar--topbar)
7. [Phase 6 — Dashboard](#7-phase-6--dashboard)
8. [Phase 7 — Course Management](#8-phase-7--course-management)
9. [Phase 8 — File Upload (TUS) & Ingest Status](#9-phase-8--file-upload-tus--ingest-status)
10. [Phase 9 — Quiz System](#10-phase-9--quiz-system)
11. [Phase 10 — Chat with RAG (SSE Streaming)](#11-phase-10--chat-with-rag-sse-streaming)
12. [Phase 11 — Analytics Dashboard (Instructor)](#12-phase-11--analytics-dashboard-instructor)
13. [Phase 12 — Marketing & SEO](#13-phase-12--marketing--seo)
14. [Cross-Cutting Concerns](#14-cross-cutting-concerns)
15. [Backend API Contract Reference](#15-backend-api-contract-reference)
16. [Verification Plan](#16-verification-plan)

---

## 1. Technology Stack & Versions

| Concern | Library | Version | Why |
|---|---|---|---|
| Framework | Next.js | 14+ (App Router) | RSC, streaming, layouts, parallel routes |
| Language | TypeScript | 5.x | Type safety end-to-end |
| Auth | Auth.js (NextAuth) | v5 | Credentials provider → Go backend JWTs |
| Data Fetching | TanStack Query | v5 | Server prefetch + client cache hydration |
| State Mgmt | Zustand | v4 | Lightweight client state (sidebar, modals, quiz session) |
| Styling | Tailwind CSS | v3.4+ | Utility-first, design token support |
| UI Components | shadcn/ui | latest | Radix primitives + Tailwind, copy-paste customisable |
| Forms | React Hook Form | v7 | Performant, Zod integration |
| Validation | Zod | v3 | Shared schemas (client + server actions) |
| Charts | Recharts | v2 | Composable SVG charts for analytics |
| File Upload | tus-js-client | v4+ | Resumable uploads → Go TUS endpoint → MinIO |
| Chat | Vercel AI SDK | v4+ | `useChat` hook with SSE streaming |
| Icons | Lucide React | latest | Tree-shakeable icon set |
| Testing (unit) | Vitest | v2 | Fast, Vite-native |
| Testing (e2e) | Playwright | latest | Cross-browser, CI-friendly |
| Linting | ESLint + Prettier | v9 / v3 | Next.js config preset |

### Key Architecture Decisions

- **Server Components by default**: Every `page.tsx` and `layout.tsx` is an RSC. Client code is pushed to leaf `"use client"` components.
- **Server prefetch → client hydrate**: Pages prefetch via `queryClient.prefetchQuery()` in RSC, pass dehydrated state via `HydrationBoundary`, and client components consume via `useSuspenseQuery()`.
- **No BFF**: The frontend calls the Go backend directly — no Next.js API routes proxying data. Only Auth.js route handlers and a chat relay exist server-side.
- **React Hook Form + Zod**: All forms validate client-side with Zod schemas, same schemas used for server action validation.

---

## 2. Phase 1 — Foundation & Project Setup

> **Goal**: Scaffold Next.js project, install dependencies, configure tooling.

### 2.1 Project Initialization

```bash
npx -y create-next-app@latest ./ \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
```

### 2.2 Dependencies

```bash
# Core
npm install @tanstack/react-query zustand zod react-hook-form @hookform/resolvers

# Auth
npm install next-auth@beta

# UI
npx shadcn@latest init
npx shadcn@latest add button card input dialog badge progress select skeleton table tabs toast

# Data viz
npm install recharts

# File upload
npm install tus-js-client

# Chat
npm install ai @ai-sdk/react

# Icons
npm install lucide-react

# Dev
npm install -D @playwright/test vitest @testing-library/react
```

### 2.3 File Structure

```
src/
├── app/           # pages + layouts (RSC by default)
├── components/    # UI components (mix of RSC and client)
├── lib/           # auth, api-client, upload, utils
├── hooks/         # TanStack Query hooks
├── stores/        # Zustand stores
├── types/         # TypeScript type definitions
└── styles/        # globals.css
```

### 2.4 Environment Configuration

**`.env.local`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_TUS_ENDPOINT=http://localhost:8080/api/v1/files/tus/
AUTH_SECRET=<random-32-char-secret>
AUTH_URL=http://localhost:3000
```

### 2.5 `next.config.ts`

```typescript
const config: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "http", hostname: "localhost", port: "9000" }],
  },
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
};
```

### Output Files
- `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`
- `.env.local`, `.env.example`
- `src/styles/globals.css` — Tailwind base + CSS variables for shadcn

---

## 3. Phase 2 — Design System & Shared Components

> **Goal**: Configure Tailwind theme, install shadcn primitives, create layout atoms.

### 3.1 Tailwind Theme

**`tailwind.config.ts`** — extend with AeroMentor brand:

```typescript
theme: {
  extend: {
    colors: {
      brand: { DEFAULT: "#2563eb", dark: "#1e40af", light: "#dbeafe" },
      surface: { DEFAULT: "#ffffff", muted: "#f8fafc" },
      destructive: "#ef4444",
    },
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "monospace"],
    },
  },
},
```

### 3.2 shadcn/ui Primitives

Install all base components listed in `tree.md`:

| Component | Usage |
|---|---|
| `Button` | All CTAs, form submits |
| `Card` | Course cards, quiz cards |
| `Dialog` | Confirm delete, create session |
| `Input` | Form fields |
| `Select` | Rank picker, difficulty picker |
| `Badge` | Difficulty, ingest status |
| `Progress` | Upload progress, quiz progress |
| `Skeleton` | Loading states |
| `Table` | Analytics tables |
| `Tabs` | Course detail tabs, quiz tabs |
| `Toast` | Success/error notifications (via `sonner`) |

### 3.3 Shared Utility Components

**`src/components/ui/`** — all installed via `shadcn add`.

### Output Files
- `tailwind.config.ts` (theme extension)
- `src/components/ui/*.tsx` — ~11 primitives

---

## 4. Phase 3 — Authentication (Auth.js v5)

> **Goal**: Credentials provider that calls Go backend `/api/v1/auth/login`, stores JWT in session, protects routes via middleware.

### 4.1 Auth Configuration

**`src/lib/auth.ts`** — Auth.js v5 config:

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // POST /api/v1/auth/login → { access_token, refresh_token, user }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        if (!res.ok) return null;

        const { data } = await res.json();
        return {
          id: data.user.id,
          name: data.user.name,
          role: data.user.role,
          rank: data.user.rank,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.rank = (user as any).rank;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      (session.user as any).role = token.role;
      (session.user as any).rank = token.rank;
      (session.user as any).accessToken = token.accessToken;
      return session;
    },
  },
});
```

### 4.2 Route Handler

**`src/app/api/auth/[...nextauth]/route.ts`**:
```typescript
export { GET, POST } from "@/lib/auth";
```

### 4.3 Middleware — Route Protection

**`middleware.ts`** (project root):

```typescript
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
  const isAppPage = req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/courses") || ...;
  const isInstructorPage = req.nextUrl.pathname.startsWith("/analytics");

  if (isAppPage && !isLoggedIn) return Response.redirect(new URL("/login", req.nextUrl));
  if (isAuthPage && isLoggedIn) return Response.redirect(new URL("/dashboard", req.nextUrl));
  if (isInstructorPage && req.auth?.user?.role !== "instructor") return Response.redirect(new URL("/dashboard", req.nextUrl));
});

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };
```

### 4.4 Type Augmentation

**`src/types/next-auth.d.ts`**:
```typescript
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: string; rank: string; accessToken: string } & DefaultSession["user"];
  }
}
```

### 4.5 Auth Pages

**`src/app/(auth)/login/page.tsx`**:
- React Hook Form + Zod validation
- Calls `signIn("credentials", { email, password })`
- Error toast on failure

**`src/app/(auth)/register/page.tsx`**:
- Calls `POST /api/v1/auth/register` directly
- On success, redirects to login
- Fields: name, enrollment_id, rank (select), batch, password, role

### Output Files
- `src/lib/auth.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `middleware.ts`
- `src/types/next-auth.d.ts`
- `src/app/(auth)/layout.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`

---

## 5. Phase 4 — API Layer & Data Fetching

> **Goal**: Typed fetch wrapper, TanStack Query provider, query hooks for every entity.

### 5.1 API Client

**`src/lib/api-client.ts`**:

```typescript
import { auth } from "@/lib/auth";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL!;
  }

  async fetch<T>(path: string, opts?: RequestInit): Promise<T> {
    const session = await auth();
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        ...(session?.user?.accessToken && { Authorization: `Bearer ${session.user.accessToken}` }),
        ...opts?.headers,
      },
    });
    const envelope = await res.json();
    if (envelope.error) throw new ApiError(envelope.error);
    return envelope.data as T;
  }
}
```

**Client-side variant** (`api-client.client.ts`): uses `useSession()` to get token instead of server-side `auth()`.

### 5.2 TanStack Query Provider

**`src/app/providers.tsx`** (`"use client"`):

```typescript
import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000, retry: 1 },
      mutations: { retry: 0 },
    },
  });
}

let browserQueryClient: QueryClient | undefined;
function getQueryClient() {
  if (isServer) return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
```

Wrap in `src/app/layout.tsx`:
```tsx
<Providers>
  <SessionProvider>{children}</SessionProvider>
</Providers>
```

### 5.3 Query Hooks

Each hook uses `queryOptions()` for shared key+fn between server prefetch and client consumption.

**`src/hooks/use-courses.ts`**:

```typescript
export const courseListOptions = (rank?: string) =>
  queryOptions({
    queryKey: ["courses", { rank }],
    queryFn: () => api.fetch<Course[]>(`/api/v1/courses${rank ? `?rank=${rank}` : ""}`),
  });

export function useCourses(rank?: string) {
  return useSuspenseQuery(courseListOptions(rank));
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseInput) => api.post<Course>("/api/v1/courses", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}
```

| Hook File | Queries | Mutations |
|---|---|---|
| `use-courses.ts` | `courseList`, `courseDetail`, `lessonList` | `create`, `update`, `delete` course/lesson |
| `use-quiz.ts` | `quizList`, `quizDetail`, `attemptResults` | `startAttempt`, `submitAnswer`, `finishAttempt`, `resetQuiz` |
| `use-analytics.ts` | `overview`, `courseMetrics` | — |
| `use-ingest-status.ts` | `ingestStatus` (polling 3s) | — |
| `use-chat.ts` | `sessionList`, `sessionHistory` | `createSession` |

### 5.4 Server Prefetch Pattern

Every `page.tsx` that displays data:

```tsx
// app/(app)/courses/page.tsx (Server Component)
export default async function CoursesPage() {
  const queryClient = new QueryClient();
  const session = await auth();

  await queryClient.prefetchQuery(courseListOptions(session?.user?.rank));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CourseGrid />  {/* client component using useCourses() */}
    </HydrationBoundary>
  );
}
```

### Output Files
- `src/lib/api-client.ts`, `src/lib/api-client.client.ts`
- `src/app/providers.tsx`
- `src/hooks/use-courses.ts`
- `src/hooks/use-quiz.ts`
- `src/hooks/use-analytics.ts`
- `src/hooks/use-ingest-status.ts`
- `src/hooks/use-chat.ts`
- `src/types/api.ts`, `src/types/course.ts`, `src/types/quiz.ts`, `src/types/user.ts`, `src/types/analytics.ts`

---

## 6. Phase 5 — Layout Shell (Sidebar + Topbar)

> **Goal**: Authenticated app shell with collapsible sidebar, topbar, and role-aware navigation.

### 6.1 Sidebar

**`src/components/layout/Sidebar.tsx`** (`"use client"`):

- Collapsible (Zustand `ui-store.ts` controls `isCollapsed`)
- Navigation items:
  - Dashboard (all users)
  - Courses (all users)
  - Chat (all users)
  - Quizzes (all users)
  - Analytics (instructor only — conditionally rendered)
- Active route highlighting via `usePathname()`
- Profile avatar + role badge at bottom

### 6.2 Topbar

**`src/components/layout/Topbar.tsx`** (`"use client"`):

- Hamburger toggle for mobile sidebar
- Breadcrumb (auto-generated from route segments)
- User avatar dropdown: Profile, Sign Out

### 6.3 App Layout

**`src/app/(app)/layout.tsx`**:

```tsx
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen">
      <Sidebar user={session.user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
```

### 6.4 Zustand Store

**`src/stores/ui-store.ts`**:

```typescript
interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}
```

### Output Files
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Topbar.tsx`
- `src/app/(app)/layout.tsx`, `src/app/(app)/loading.tsx`
- `src/stores/ui-store.ts`

---

## 7. Phase 6 — Dashboard

> **Goal**: Role-aware landing page — students see courses + quiz scores, instructors see analytics summary.

### 7.1 Student View

- **Recent courses** card grid (top 4 by last accessed)
- **Quiz scores** — last 5 attempts with scores
- **Chat sessions** — recent 3 sessions
- Quick-action buttons: "New Chat", "Browse Courses"

### 7.2 Instructor View

- **Total students** enrolled across all courses
- **Course count** with publish status
- **Average quiz scores** across all courses
- **Recent file ingests** — status badges (pending/processing/done/failed)

### Output Files
- `src/app/(app)/dashboard/page.tsx`
- `src/app/(app)/dashboard/loading.tsx`

---

## 8. Phase 7 — Course Management

> **Goal**: Course CRUD, lesson management, course detail with lesson tree.

### 8.1 Course List Page

**`src/app/(app)/courses/page.tsx`**:

- Server prefetch `courseListOptions(rank)` for students, `coursesByInstructor` for instructors
- Renders `<CourseGrid />` — responsive grid of `<CourseCard />`
- Each card: title, description (truncated), rank badge, lesson count, instructor name
- Instructor sees "New Course" button → `/courses/new`

### 8.2 Course Detail Page

**`src/app/(app)/courses/[courseId]/page.tsx`**:

- Tabs: Overview | Lessons | Files (instructor only)
- **Overview**: title, description, rank, instructor, created date
- **Lessons**: ordered list, each expandable to show files
- Instructor sees Edit/Delete buttons
- Prefetch: `courseDetail` + `lessonList` + `filesByLesson`

### 8.3 Course Create/Edit

**`src/app/(app)/courses/new/page.tsx`** and **`src/app/(app)/courses/[courseId]/edit/page.tsx`**:

- React Hook Form + Zod schema
- Fields: title (required), description (textarea), rank (select: trainee → air marshal)
- Submit → `useCreateCourse()` / `useUpdateCourse()` mutation
- Success → redirect to course detail

### 8.4 Lesson Management

Inline within course detail page:
- "Add Lesson" button → inline form (title, order)
- Edit/Delete per lesson
- Drag-to-reorder (optional, stretch goal)

### 8.5 Components

| Component | Props | Behavior |
|---|---|---|
| `CourseCard` | `course` | Click → `/courses/{id}`, rank badge, lesson count |
| `CourseGrid` | `courses` | Responsive grid, empty state |
| `CourseForm` | `initialData?` | Create/edit form, rank selector |

### Output Files
- `src/app/(app)/courses/page.tsx`, `loading.tsx`
- `src/app/(app)/courses/new/page.tsx`
- `src/app/(app)/courses/[courseId]/page.tsx`, `loading.tsx`
- `src/app/(app)/courses/[courseId]/edit/page.tsx`
- `src/components/course/CourseCard.tsx`
- `src/components/course/CourseGrid.tsx`
- `src/components/course/CourseForm.tsx`

---

## 9. Phase 8 — File Upload (TUS) & Ingest Status

> **Goal**: Resumable file uploads via `tus-js-client` → Go TUS endpoint → MinIO, with real-time ingest status polling.

### 9.1 TUS Client Setup

**`src/lib/upload.ts`**:

```typescript
import * as tus from "tus-js-client";

export function createUpload(
  file: File,
  metadata: { lessonId: string; fileType: string; instructorId: string },
  onProgress: (pct: number) => void,
  onSuccess: () => void,
  token: string,
): tus.Upload {
  return new tus.Upload(file, {
    endpoint: process.env.NEXT_PUBLIC_TUS_ENDPOINT,
    retryDelays: [0, 3000, 5000, 10000, 20000],
    metadata: {
      lesson_id: metadata.lessonId,
      file_name: file.name,
      file_type: metadata.fileType,
      instructor_id: metadata.instructorId,
    },
    headers: { Authorization: `Bearer ${token}` },
    onProgress: (uploaded, total) => onProgress((uploaded / total) * 100),
    onSuccess,
    onError: (err) => console.error("Upload failed:", err),
  });
}
```

### 9.2 Upload Components

**`src/components/course/FileUploadZone.tsx`** (`"use client"`):

```
1. Drag-and-drop zone (or file picker)
2. Accept: .pdf, .ppt, .pptx, .docx
3. On file select → createUpload() → start()
4. Show UploadProgress bar
5. On success → invalidate file list query + start polling ingest status
```

**`src/components/course/UploadProgress.tsx`**:
- Animated progress bar with percentage
- Cancel button → `upload.abort()`
- Resume support via `upload.findPreviousUploads()`

**`src/components/course/IngestStatusBadge.tsx`** (`"use client"`):
- Uses `useIngestStatus(fileId)` hook — polls `GET /files/{id}/status` every 3 seconds
- Badge colors: pending (gray), processing (amber pulse), done (green), failed (red)
- Stops polling once status is `done` or `failed`

### 9.3 Ingest Status Polling Hook

**`src/hooks/use-ingest-status.ts`**:

```typescript
export function useIngestStatus(fileId: string) {
  return useQuery({
    queryKey: ["ingestStatus", fileId],
    queryFn: () => api.fetch<{ status: string }>(`/api/v1/files/${fileId}/status`),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "done" || status === "failed" ? false : 3000;
    },
  });
}
```

### 9.4 File Viewer

**`src/components/course/FileViewer.tsx`**:
- PDF: `<iframe>` with presigned URL from `GET /files/{id}/view`
- DOCX/PPTX: download button with presigned URL

### Output Files
- `src/lib/upload.ts`
- `src/app/(app)/courses/[courseId]/files/page.tsx`
- `src/components/course/FileUploadZone.tsx`
- `src/components/course/UploadProgress.tsx`
- `src/components/course/IngestStatusBadge.tsx`
- `src/components/course/FileViewer.tsx`
- `src/hooks/use-ingest-status.ts`

---

## 10. Phase 9 — Quiz System

> **Goal**: Full quiz lifecycle — browse, take, submit, review results, instructor reset.

### 10.1 Quiz List Page

**`src/app/(app)/quizzes/page.tsx`**:

- Select a course → list quizzes grouped by difficulty (easy/medium/hard)
- Each quiz card: difficulty badge, question count, status (generating/ready), last attempt score
- Click → start or review

### 10.2 Quiz Take Page

**`src/app/(app)/quizzes/[quizId]/page.tsx`** (`"use client"`):

- On mount: `startAttempt` mutation → get `attemptId`
- Renders questions one-by-one or all-at-once (user preference)
- For each question: options (radio buttons for MCQ, textarea for open-ended)
- Submit each answer → `submitAnswer` mutation
- Finish button → `finishAttempt` mutation → redirect to results

### 10.3 Quiz Results Page

**`src/app/(app)/quizzes/[quizId]/results/page.tsx`**:

- Score summary: correct/total, percentage
- Per-question breakdown: user answer vs correct answer, green/red highlight
- "Retake" button

### 10.4 Zustand Quiz Store

**`src/stores/quiz-store.ts`**:

```typescript
interface QuizState {
  attemptId: string | null;
  currentQuestion: number;
  answers: Record<string, string>;
  setAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  reset: () => void;
}
```

### 10.5 Components

| Component | Purpose |
|---|---|
| `QuizCard` | Course → quiz card with difficulty badge |
| `QuizQuestion` | Single question renderer (MCQ or open-ended) |
| `QuizTimer` | Optional countdown timer |
| `QuizResults` | Results breakdown with score |
| `DifficultyBadge` | color-coded: green/amber/red |
| `QuizResetButton` | Instructor-only: triggers `resetQuiz` mutation |

### Output Files
- `src/app/(app)/quizzes/page.tsx`, `loading.tsx`
- `src/app/(app)/quizzes/[quizId]/page.tsx`
- `src/app/(app)/quizzes/[quizId]/results/page.tsx`
- `src/components/quiz/*.tsx` — 6 components
- `src/stores/quiz-store.ts`
- `src/hooks/use-quiz.ts`

---

## 11. Phase 10 — Chat with RAG (SSE Streaming)

> **Goal**: GPT-style chat interface with SSE streaming from Go backend, source citations.

### 11.1 Architecture

```
Frontend (useChat) → Next.js route handler (relay) → Go /chat/sessions/{id}/message (SSE)
                                                        ↓
                                                    RAG engine → Qdrant → LLM → SSE frames
```

**Why a relay?** The Go backend requires JWT auth. The `useChat` hook sends requests to a Next.js route handler, which injects the JWT and relays the SSE stream.

### 11.2 Chat Relay Route Handler

**`src/app/api/chat/route.ts`**:

```typescript
export async function POST(req: Request) {
  const session = await auth();
  const body = await req.json();
  const { sessionId, message } = body;

  const upstream = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/sessions/${sessionId}/message`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify({ message }),
    }
  );

  // Relay SSE stream
  return new Response(upstream.body, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
```

### 11.3 Chat Hook

**`src/hooks/use-chat.ts`**:

```typescript
import { useChat as useVercelChat } from "@ai-sdk/react";

export function useChatSession(sessionId: string) {
  return useVercelChat({
    api: "/api/chat",
    body: { sessionId },
  });
}
```

### 11.4 Components

| Component | Purpose |
|---|---|
| `ChatSessionList` | Sidebar: list sessions, "New Chat" button, course scope selector |
| `ChatWindow` | Main chat area: `MessageList` + `ChatInput` |
| `MessageList` | Scrollable message list with auto-scroll |
| `MessageBubble` | User (right, blue) / AI (left, gray), markdown rendering |
| `ChatInput` | Text input + send button, disabled during streaming |
| `SourceCitation` | Expandable: shows source file name, course, chunk preview |

### 11.5 Chat Session Pages

**`src/app/(app)/chat/page.tsx`**: Session list + "New Chat" button
**`src/app/(app)/chat/[sessionId]/page.tsx`**: Full chat window

### Output Files
- `src/app/api/chat/route.ts`
- `src/app/(app)/chat/page.tsx`, `loading.tsx`
- `src/app/(app)/chat/[sessionId]/page.tsx`
- `src/components/chat/*.tsx` — 6 components
- `src/hooks/use-chat.ts`

---

## 12. Phase 11 — Analytics Dashboard (Instructor)

> **Goal**: Visual analytics for instructors — student engagement, quiz performance, file ingest status.

### 12.1 Analytics Overview

**`src/app/(app)/analytics/page.tsx`**:

- Total students across all courses
- Total quizzes generated
- Average quiz score
- Top-performing students table
- Charts: enrollment trend, score distribution

### 12.2 Per-Course Analytics

**`src/app/(app)/analytics/[courseId]/page.tsx`**:

- Student list with quiz scores per difficulty
- File ingest status table
- Score distribution chart (Recharts bar chart)

### 12.3 Components

| Component | Chart Type |
|---|---|
| `EngagementChart` | Line chart — enrollments over time |
| `QuizScoreDistribution` | Bar chart — score ranges |
| `StudentRankTable` | Table — student name, rank, avg score |
| `FileIngestTable` | Table — file name, status badge, upload date |

### Output Files
- `src/app/(app)/analytics/page.tsx`, `loading.tsx`
- `src/app/(app)/analytics/[courseId]/page.tsx`
- `src/components/analytics/*.tsx` — 4 components
- `src/hooks/use-analytics.ts`

---

## 13. Phase 12 — Marketing & SEO

> **Goal**: Public marketing page with SEO metadata.

### 13.1 Marketing Page

**`src/app/(marketing)/page/page.tsx`**:

- Hero section: tagline, CTA buttons (Register / Login)
- Features grid: AI Chat, Auto Quizzes, Smart Analytics
- Footer with links

### 13.2 Layout

**`src/app/(marketing)/page/layout.tsx`**:

- `MarketingNav` — logo + Login/Register buttons
- `Footer`
- No sidebar

### 13.3 SEO

Every page includes:
```tsx
export const metadata: Metadata = {
  title: "AeroMentor — AI-Powered Aviation Training",
  description: "...",
  openGraph: { images: ["/og-image.png"] },
};
```

### Output Files
- `src/app/(marketing)/page/page.tsx`, `layout.tsx`
- `src/components/layout/MarketingNav.tsx`
- `src/components/layout/Footer.tsx`

---

## 14. Cross-Cutting Concerns

### 14.1 Error Handling

- API client throws typed `ApiError` (code + message from backend envelope)
- React Query `onError` → toast notification via `sonner`
- `error.tsx` boundary catches unhandled errors per route segment

### 14.2 Loading States

- Every route has a `loading.tsx` with `<Skeleton />` matching the page layout
- TanStack Query `useSuspenseQuery` integrates with Next.js Suspense boundaries

### 14.3 Form Validation

All forms use this stack:
```
Zod schema → React Hook Form resolver → Server Action or client mutation
```

Example Zod schema:
```typescript
const courseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(1000),
  rank: z.enum(["trainee", "flying_officer", "flight_lieutenant", ...]),
});
```

### 14.4 Responsive Design

- Sidebar collapses to hamburger on mobile (<768px)
- Course grid: 1 col (mobile) → 2 col (tablet) → 3 col (desktop)
- Chat: full-width on mobile, split sidebar+main on desktop

### 14.5 Accessibility

- All interactive elements have aria labels
- shadcn/ui built on Radix — handles focus management, keyboard navigation
- Color contrast meets WCAG 2.1 AA

---

## 15. Backend API Contract Reference

### Authentication
| Method | Endpoint | Body | Response |
|---|---|---|---|
| POST | `/api/v1/auth/register` | `{ name, enrollment_id, rank, batch, password, role }` | `{ user }` |
| POST | `/api/v1/auth/login` | `{ enrollment_id, password }` | `{ access_token, refresh_token, user }` |
| POST | `/api/v1/auth/refresh` | `{ refresh_token }` | `{ access_token }` |
| GET | `/api/v1/users/me` | — | `{ user }` |

### Courses & Lessons
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/v1/courses` | JWT |
| POST | `/api/v1/courses` | JWT + instructor |
| GET | `/api/v1/courses/{id}` | JWT |
| PUT | `/api/v1/courses/{id}` | JWT + instructor |
| DELETE | `/api/v1/courses/{id}` | JWT + instructor |
| GET | `/api/v1/courses/{id}/lessons` | JWT |
| POST | `/api/v1/courses/{id}/lessons` | JWT + instructor |
| PUT | `/api/v1/lessons/{id}` | JWT + instructor |
| DELETE | `/api/v1/lessons/{id}` | JWT + instructor |

### Files (TUS)
| Method | Endpoint | Auth |
|---|---|---|
| POST/PATCH/HEAD | `/api/v1/files/tus/*` | JWT + instructor |
| GET | `/api/v1/lessons/{id}/files` | JWT |
| GET | `/api/v1/files/{id}/status` | JWT |
| GET | `/api/v1/files/{id}/view` | JWT |

### Quizzes
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/v1/courses/{id}/quizzes` | JWT |
| GET | `/api/v1/quizzes/{id}` | JWT |
| POST | `/api/v1/quizzes/{id}/attempt` | JWT |
| POST | `/api/v1/attempts/{id}/answer` | JWT |
| POST | `/api/v1/attempts/{id}/finish` | JWT |
| GET | `/api/v1/attempts/{id}/results` | JWT |
| POST | `/api/v1/quizzes/{id}/reset` | JWT + instructor |

### Chat
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/v1/chat/sessions` | JWT |
| POST | `/api/v1/chat/sessions` | JWT |
| POST | `/api/v1/chat/sessions/{id}/message` | JWT (SSE) |
| GET | `/api/v1/chat/sessions/{id}/history` | JWT |

### Analytics
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/v1/analytics` | JWT + instructor |
| GET | `/api/v1/analytics/{courseId}` | JWT + instructor |

---

## 16. Verification Plan

### Phase-by-Phase

| Phase | Verification |
|---|---|
| 1 | `npm run dev` starts, no errors |
| 2 | shadcn components render in Storybook/test page |
| 3 | Login → redirect to dashboard, logout → redirect to login, instructor guard works |
| 4 | Server prefetch + client hydration works (no flash), mutations invalidate correctly |
| 5 | Sidebar collapses, topbar shows user, responsive works |
| 6 | Dashboard shows role-appropriate content |
| 7 | Create course → appears in list, edit → reflects changes, delete → removed |
| 8 | Upload file → progress bar → ingest status polling → badge turns green |
| 9 | Start quiz → answer questions → finish → see results with correct/incorrect |
| 10 | Send chat message → see streaming response → source citations appear |
| 11 | Analytics page shows charts + tables with real data |
| 12 | Marketing page loads, SEO tags present in source |

### E2E Tests (Playwright)

```bash
npx playwright test
```

Test suites:
- `auth.spec.ts`: register → login → protected route → logout
- `courses.spec.ts`: create → edit → upload file → verify ingest
- `quiz.spec.ts`: browse → take quiz → submit → view results

### Integration

Full flow test (requires all services running):
```
Register → Login → Create Course → Add Lesson → Upload File →
Wait Ingest Done → Start Chat → Send Message → See Response →
Browse Quizzes → Take Quiz → Submit → View Results →
Check Analytics
```
