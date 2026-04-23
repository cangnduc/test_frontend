# Next.js Auth & CASL Permission Guide

> **Stack:** Next.js 16 (App Router, Cache Components) · React 19 · Better-Auth · CASL · Prisma  
> **Last updated:** 2026-04-22  
> **Prerequisite reading:** [Backend route-protection-guide](../../backend/docs/route-protection-guide.md), [Backend casl_implementation](../../backend/docs/casl_implematation.md)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture — Frontend vs Backend](#2-architecture--frontend-vs-backend)
3. [Next.js 16 & React 19 — Key Concepts](#3-nextjs-16--react-19--key-concepts)
4. [Current State & What's Missing](#4-current-state--whats-missing)
5. [Setup — Sharing CASL from Backend](#5-setup--sharing-casl-from-backend)
6. [Getting the Session (Server-Side)](#6-getting-the-session-server-side)
7. [Building the Ability (Server-Side)](#7-building-the-ability-server-side)
8. [Conditional Rendering in Server Components](#8-conditional-rendering-in-server-components)
9. [Client Components — useAbility Hook](#9-client-components--useability-hook)
10. [Route Protection — Middleware](#10-route-protection--middleware)
11. [Direct Database Queries with CASL](#11-direct-database-queries-with-casl)
12. [Server Actions with Permission Checks](#12-server-actions-with-permission-checks)
13. [Common Patterns](#13-common-patterns)
14. [FAQ & Troubleshooting](#14-faq--troubleshooting)

---

## 1. Overview

The Next.js frontend operates as a **semi-fullstack** application. It can:

1. **Conditionally render UI** based on the user's role and permissions (via CASL)
2. **Protect routes** via Next.js middleware (redirect unauthenticated users)
3. **Query the database directly** using Prisma (bypassing the Fastify backend for read-heavy pages)
4. **Call Server Actions** for mutations with permission checks

To achieve this, we reuse the **exact same CASL permission definitions** from the backend. This guarantees that the frontend and backend always agree on what a user can or cannot do.

| Concern                             | Tool                                       | Where It Runs                                        |
| ----------------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| **Identity** (who is this?)         | Better-Auth                                | Server Components, Server Actions, Middleware        |
| **Permissions** (can they do this?) | CASL                                       | Server Components, Server Actions, Client Components |
| **Data access**                     | Prisma (direct) or fetch (via backend API) | Server Components, Server Actions                    |

---

## 2. Architecture — Frontend vs Backend

```
┌───────────────────────────────────────────────────────────────┐
│  Shared: backend/src/auth/casl/                               │
│  ├── ability.ts     (Actions, Subjects, AppAbility types)     │
│  ├── types.ts       (AppUser interface)                       │
│  └── roles/         (defineAbilityFor, per-role definers)     │
│        ↑ imported by BOTH backend & frontend                  │
└───────────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌──────────────────────┐    ┌───────────────────────────────────┐
│  Backend (Fastify)   │    │  Frontend (Next.js 16)            │
│  ──────────────────  │    │  ──────────────────────────────   │
│  caslPlugin (lazy)   │    │  getSession() + defineAbilityFor  │
│  authenticate()      │    │  → Server Components + <Suspense> │
│  authorize()         │    │  → Server Actions                 │
│  Route handlers      │    │  → middleware.ts (cookie check)   │
│  Service layer       │    │  → Client components (via props)  │
└──────────────────────┘    └───────────────────────────────────┘
```

> [!IMPORTANT]
> The CASL definitions live in `backend/src/auth/casl/`. **one source of truth** — if you update a permission rule in the backend, you need to manually update it in the frontend as well in `frontend/src/auth/casl/`.

---

## 3. Next.js 16 & React 19 — Key Concepts

This section explains the caching and rendering model that affects how we implement auth and CASL on the frontend.

### Cache Components (`use cache` directive)

Next.js 16 introduces **Cache Components** — a new opt-in caching model using the `use cache` directive. Key rules:

| Concept                               | Behavior                                                         |
| ------------------------------------- | ---------------------------------------------------------------- |
| **All pages are dynamic by default**  | No need for `dynamic = "force-dynamic"`                          |
| **Opt-in caching** with `"use cache"` | Add the directive at file, component, or function level          |
| **`cacheLife()`** for cache duration  | Replaces `revalidate` config: `'hours'`, `'days'`, `'max'` etc.  |
| **`cacheTag()`** for invalidation     | Tag cached entries, then call `revalidateTag()` or `updateTag()` |

### Runtime APIs and `<Suspense>`

Components that call runtime APIs (`cookies()`, `headers()`, `searchParams`) **must be wrapped in `<Suspense>`**. This is because they can't complete during prerendering:

```tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <h1>Dashboard</h1>
      {/* UserGreeting calls cookies() → needs Suspense */}
      <Suspense fallback={<p>Loading...</p>}>
        <UserGreeting />
      </Suspense>
    </>
  );
}
```

> [!IMPORTANT]
> **Our `getSession()` calls `headers()`**, making it a runtime API. Any Server Component that calls `getSession()` or `getAbility()` is a **dynamic component** and must either:
>
> - Be wrapped in `<Suspense>` by a parent, **or**
> - Be the page/layout itself (which is dynamic by default)

### `React.cache()` — Still Useful, But Scoped

`React.cache()` deduplicates async calls **within a single server render pass**. It still works in Next.js 16 for deduplication outside `use cache` boundaries. However:

- **Inside a `use cache` boundary**, `React.cache()` operates in an **isolated scope** — values stored outside are not visible inside.
- **The React Compiler** (React 19) auto-memoizes components, reducing the need for manual `useMemo`/`useCallback` in client components.

For our auth use case, `React.cache()` is still the right tool for `getSession()` and `getAbility()`, since these are **per-request** calls (dynamic, never cached across requests).

### What NOT to Cache

> [!CAUTION]
> **Never use `"use cache"` on `getSession()` or `getAbility()`**. These return user-specific data based on runtime cookies — caching them would serve one user's session/permissions to another user.

---

## 4. Current State & What's Missing

### ✅ Already Done

| Feature                        | File                                      | Status                 |
| ------------------------------ | ----------------------------------------- | ---------------------- |
| Better-Auth server config      | `src/lib/auth/auth.ts` & `auth-server.ts` | ✅ Working             |
| Better-Auth client             | `src/lib/auth/auth-client.ts`             | ✅ Working             |
| Auth API route                 | `src/app/api/auth/[...all]/route.ts`      | ✅ Working             |
| Session fetching (server-side) | `src/actions/getSession.ts`               | ✅ Working (via fetch) |
| Prisma client                  | `src/lib/prisma.ts`                       | ✅ Working             |

### ❌ Missing (What This Guide Covers)

| Feature                                     | Status          |
| ------------------------------------------- | --------------- |
| CASL integration (import from backend)      | 🔧 To setup     |
| `getAbility()` helper for Server Components | 🔧 To create    |
| Conditional rendering with `ability.can()`  | 🔧 To implement |
| `useAbility` client hook (React Context)    | 🔧 To create    |
| Next.js middleware route guards             | 🔧 To create    |
| Server Actions with permission checks       | 🔧 To implement |

---

## 5. Setup — Sharing CASL from Backend

### Step 1: Install CASL in the Frontend

```bash
cd frontend
npm install @casl/ability
```

### Step 2: add cache components

Add cache components in `next.config.ts`:

```typescript
// frontend/next.config.ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Enable Cache Components (Next.js 16)
  cacheComponents: true,
};
export default nextConfig;
```

### Step 3: Handle Shared Enum Re-Export

The backend's `types.ts` imports `UserRole` from `@/prisma/generated/prisma/enums`. Since the frontend has its own Prisma generation, create a compatibility shim:

```typescript
// frontend/src/lib/casl/user-role.ts
// Re-export UserRole from the frontend's Prisma generation
// This matches the backend's UserRole enum exactly
export { UserRole } from "@/prisma/generated/prisma/client";
```

**Alternative (simpler approach):** Copy the CASL files into the frontend directly:

```
frontend/src/lib/casl/
├── ability.ts          ← Copy from backend (adjust imports)
├── types.ts            ← Copy from backend (adjust UserRole import)
└── roles/
    ├── index.ts        ← Copy from backend
    ├── guest.ts
    ├── student.ts
    ├── teacher.ts
    ├── moderator.ts
    ├── admin.ts
    └── parent.ts
```

> [!WARNING]
> If you copy instead of sharing, you must **manually keep them in sync**. Any permission change in the backend must be reflected in the frontend copy.

---

## 6. Getting the Session (Server-Side)

### Using Better-Auth's `auth.api.getSession()` (Recommended)

```typescript
// frontend/src/lib/auth/get-session.ts
import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

/**
 * Get the current user's session in a Server Component or Server Action.
 * Returns null if not authenticated.
 *
 * This calls headers() which is a runtime API.
 * Components using this MUST be wrapped in <Suspense>
 * or be in a dynamic (non-cached) context.
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}
```



> [!IMPORTANT]
> `getSession()` calls `headers()`, which is a **runtime API** in Next.js 16. This means:
>
> - It **cannot** be used inside a `"use cache"` scope
> - Components calling it must be wrapped in `<Suspense>` or be in a dynamic context
> - Use `import "server-only"` to prevent accidental client-side imports

### Type Exports

```typescript
// frontend/src/lib/auth/types.ts
import { auth } from "@/lib/auth/auth";

export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];
```

---

## 7. Building the Ability (Server-Side)

Create a helper that gets the session and builds the CASL ability in one call:

```typescript
// frontend/src/lib/casl/get-ability.ts
import "server-only";
import { cache } from "react";
import { getSession } from "@/lib/auth/get-session";
import { defineAbilityFor } from "@casl-shared/roles";
// OR if using the copy approach:
// import { defineAbilityFor } from "@/lib/casl/roles";
import type { AppAbility } from "@casl-shared/ability";
import type { AppUser } from "@casl-shared/types";

/**
 * Build the CASL ability for the current request.
 *
 * Uses React.cache() to deduplicate within a single server render —
 * multiple components calling getAbility() in the same request
 * will share the same session fetch and ability build.
 *
 * ⚠️ This calls getSession() which uses headers() — a runtime API.
 * Components using this must be in a dynamic (non-cached) context.
 * Do NOT use inside "use cache" boundaries.
 */
export const getAbility = cache(async (): Promise<AppAbility> => {
  const session = await getSession();

  if (!session?.user) {
    // Guest ability (public reads only)
    return defineAbilityFor(undefined);
  }

  const user: AppUser = {
    id: session.user.id,
    role: (session.user.role as AppUser["role"]) ?? "USER",
    banned: session.user.banned ?? false,
  };

  return defineAbilityFor(user);
});
```

### Why `React.cache()` and NOT `"use cache"`

|                              | `React.cache()`                    | `"use cache"` directive                |
| ---------------------------- | ---------------------------------- | -------------------------------------- |
| **Scope**                    | Per-request deduplication          | Cross-request caching                  |
| **Shares across components** | ✅ Same render pass                | ❌ Isolated scope                      |
| **Uses runtime APIs**        | ✅ Yes (`headers()`, `cookies()`)  | ❌ Cannot access runtime APIs          |
| **Right for auth?**          | ✅ **Yes — per-user, per-request** | ❌ Would cache one user's data for all |

> [!CAUTION]
> **Never use `"use cache"` on `getSession()` or `getAbility()`.** These are per-user, per-request functions that depend on runtime cookies. Caching them would serve one user's session to another.

---

## 8. Conditional Rendering in Server Components

### Understanding the Rendering Model

Since `getAbility()` calls `headers()` (a runtime API), any component that uses it is a **dynamic component**. In Next.js 16 with Cache Components:

- Dynamic components must be wrapped in `<Suspense>` by their parent
- Or the page itself can be dynamic (no `"use cache"` at page level)

### Pattern: Dynamic Page with Permission Checks

Since pages are dynamic by default (no `"use cache"`), you can call `getAbility()` directly:

```tsx
// Server Component — page is dynamic by default
import { getAbility } from "@/lib/casl/get-ability";

export default async function QuestionListPage() {
  const ability = await getAbility();

  return (
    <div>
      <h1>Questions</h1>

      {/* Only show "Create" button if user can create questions */}
      {ability.can("create", "Question") && (
        <a href="/questions/new" className="btn-primary">
          + New Question
        </a>
      )}

      {/* Only show admin panel link for users who can manage all */}
      {ability.can("read", "SystemLog") && <a href="/admin">Admin Panel</a>}

      {/* Everyone sees the list (guest can read public questions) */}
      <QuestionList />
    </div>
  );
}
```

### Pattern: Mixed Cached + Dynamic Page (PPR)

Use Next.js 16's Partial Prerendering to cache the static shell while streaming auth-dependent content:

```tsx
// frontend/src/app/questions/page.tsx
import { Suspense } from "react";
import { getAbility } from "@/lib/casl/get-ability";

// The page itself has a cached shell + dynamic parts
export default function QuestionsPage() {
  return (
    <div>
      {/* Static content — prerendered in the shell */}
      <h1>Questions</h1>
      <p>Browse our question bank.</p>

      {/* Dynamic: permission-aware toolbar, streamed at request time */}
      <Suspense fallback={<div className="toolbar-skeleton" />}>
        <QuestionToolbar />
      </Suspense>

      {/* Dynamic: filtered question list */}
      <Suspense fallback={<p>Loading questions...</p>}>
        <QuestionList />
      </Suspense>
    </div>
  );
}

// This component calls getAbility() → uses headers() → dynamic
async function QuestionToolbar() {
  const ability = await getAbility();

  return (
    <div className="toolbar">
      {ability.can("create", "Question") && (
        <a href="/questions/new">+ New Question</a>
      )}
      {ability.can("read", "AuditLog") && <a href="/admin">Admin Panel</a>}
    </div>
  );
}
```

> [!TIP]
> **This is Partial Prerendering (PPR)**. The `<h1>` and `<p>` are included in the static HTML shell. The `QuestionToolbar` streams in at request time with the correct permissions. Users see the page instantly with placeholder skeletons, then the dynamic parts fill in.

### Pattern: Role-Aware Dashboard

```tsx
import { Suspense } from "react";
import { getAbility } from "@/lib/casl/get-ability";
import { getSession } from "@/lib/auth/get-session";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const session = await getSession();
  if (!session) redirect("/login");

  const ability = await getAbility();

  return (
    <main>
      <h1>Welcome, {session.user.name}</h1>

      {/* Student section */}
      {ability.can("create", "TestAttempt") && (
        <section>
          <h2>My Tests</h2>
          <StudentTestList userId={session.user.id} />
        </section>
      )}

      {/* Teacher section */}
      {ability.can("create", "Question") && (
        <section>
          <h2>Content Management</h2>
          <TeacherContentPanel />
        </section>
      )}

      {/* Moderator section */}
      {ability.can("ban", "User") && (
        <section>
          <h2>Moderation</h2>
          <ModerationPanel />
        </section>
      )}

      {/* Admin section */}
      {ability.can("read", "AuditLog") && (
        <section>
          <h2>System Administration</h2>
          <AdminPanel />
        </section>
      )}
    </main>
  );
}
```

### Pattern: Instance-Level Check in Server Component

```tsx
import { getAbility } from "@/lib/casl/get-ability";
import { subject } from "@casl/ability";
import { prisma } from "@/lib/prisma";

export async function QuestionActions({ questionId }: { questionId: string }) {
  const ability = await getAbility();
  const question = await prisma.question.findUniqueOrThrow({
    where: { id: Number(questionId) },
  });

  return (
    <div>
      {/* Only show edit if user can update THIS specific question */}
      {ability.can("update", subject("Question", question)) && (
        <a href={`/questions/${questionId}/edit`}>Edit</a>
      )}

      {/* Only show delete if user can delete THIS specific question */}
      {ability.can("delete", subject("Question", question)) && (
        <button>Delete</button>
      )}
    </div>
  );
}
```

---

## 9. Client Components — useAbility Hook

Client Components can't call `getAbility()` directly (it's server-only). Instead, serialize the ability rules from the server and hydrate them on the client.

### Step 1: Create an AbilityProvider

```tsx
// frontend/src/providers/AbilityProvider.tsx
"use client";

import { createContext, useContext } from "react";
import { createMongoAbility, type RawRuleOf } from "@casl/ability";
import type { AppAbility } from "@casl-shared/ability";

const AbilityContext = createContext<AppAbility | null>(null);

interface AbilityProviderProps {
  rules: RawRuleOf<AppAbility>[];
  children: React.ReactNode;
}

export function AbilityProvider({ rules, children }: AbilityProviderProps) {
  // React 19 + React Compiler auto-memoizes this — no useMemo needed
  const ability = createMongoAbility<AppAbility>(rules);

  return <AbilityContext value={ability}>{children}</AbilityContext>;
}

/**
 * Access the CASL ability in any client component.
 * Must be used within an <AbilityProvider>.
 */
export function useAbility(): AppAbility {
  const ability = useContext(AbilityContext);
  if (!ability) {
    throw new Error("useAbility must be used within an <AbilityProvider>");
  }
  return ability;
}
```

> [!NOTE]
> **React 19 change:** We use `<AbilityContext value={...}>` instead of `<AbilityContext.Provider value={...}>`. React 19 supports rendering context directly as a provider. Also, the React Compiler handles memoization automatically — no `useMemo` wrapper needed for the `createMongoAbility` call.

### Step 2: Wrap Layout with AbilityProvider

Since `getAbility()` is a runtime API call, the layout that uses it becomes dynamic. Wrap the auth-dependent part in `<Suspense>`:

```tsx
// frontend/src/app/layout.tsx
import { Suspense } from "react";
import { getAbility } from "@/lib/casl/get-ability";
import { AbilityProvider } from "@/providers/AbilityProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
        </Suspense>
      </body>
    </html>
  );
}

// Separate component so getAbility() (runtime API) runs inside Suspense
async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ability = await getAbility();

  return <AbilityProvider rules={ability.rules}>{children}</AbilityProvider>;
}
```

### Step 3: Use in Client Components

```tsx
"use client";

import { useAbility } from "@/providers/AbilityProvider";

export function CreateQuestionButton() {
  const ability = useAbility();

  if (!ability.can("create", "Question")) {
    return null; // Hide button for users who can't create
  }

  return (
    <button
      onClick={() => {
        /* open create modal */
      }}
    >
      + New Question
    </button>
  );
}
```

> [!WARNING]
> **Client-side permission checks are for UI convenience only.** They improve UX by hiding inaccessible UI, but the actual security enforcement must happen on:
>
> - **Server Actions** (for mutations)
> - **API routes / Backend** (for data access)
>
> Never trust client-side ability checks as a security boundary!

---

## 10. Route Protection — Middleware

Use Next.js middleware for **route-level** protection. This runs before the page renders and can redirect unauthenticated users.

```typescript
// frontend/src/middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes that require authentication
const protectedPaths = [
  "/dashboard",
  "/questions/new",
  "/tests/new",
  "/admin",
  "/profile",
];

// Routes only for unauthenticated users (login, signup)
const authPaths = ["/login", "/sign-up"];

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = !!sessionCookie;
  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users away from protected routes
  if (!isAuthenticated && protectedPaths.some((p) => pathname.startsWith(p))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, images, etc.
     * - api/auth (Better-Auth endpoints)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

> [!NOTE]
> Middleware runs on the **Edge** and cannot do full CASL checks (no Prisma access). It only checks for session cookie existence. **Role-specific** access control is handled at the page/component level using `getAbility()`.
>
> For example: Middleware ensures `/admin` requires login. The `AdminPage` Server Component then uses `ability.can("read", "AuditLog")` to verify the user is actually an admin, and redirects otherwise.

### Page-Level Role Guard Pattern

```tsx
// frontend/src/app/admin/layout.tsx
import { Suspense } from "react";
import { getAbility } from "@/lib/casl/get-ability";
import { getSession } from "@/lib/auth/get-session";
import { redirect } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<p>Checking permissions...</p>}>
      <AdminGuard>{children}</AdminGuard>
    </Suspense>
  );
}

async function AdminGuard({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const ability = await getAbility();

  // Only ADMIN and MOD can access the admin area
  if (!ability.can("read", "AuditLog") && !ability.can("ban", "User")) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
```

---

## 11. Direct Database Queries with CASL

Since the frontend shares the same PostgreSQL database, you can query Prisma directly in Server Components and Server Actions — no backend API call needed.

### Pattern: Filtered List Based on Ability

```tsx
// frontend/src/app/questions/page.tsx
import { Suspense } from "react";
import { getAbility } from "@/lib/casl/get-ability";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";

export default function QuestionsPage() {
  return (
    <div>
      <h1>Questions</h1>
      <Suspense fallback={<p>Loading questions...</p>}>
        <QuestionListWithPermissions />
      </Suspense>
    </div>
  );
}

async function QuestionListWithPermissions() {
  const ability = await getAbility();
  const session = await getSession();

  // Build a Prisma where clause based on the user's permissions
  let whereClause: any = {};

  if (ability.can("read", "Question")) {
    if (ability.can("manage", "all")) {
      // Admin: see everything
      whereClause = {};
    } else if (session?.user && ability.can("create", "Question")) {
      // Teacher/Mod: see own + public
      whereClause = {
        OR: [
          { visibility: "PUBLIC" },
          { createdById: Number(session.user.id) },
        ],
      };
    } else {
      // Student/Guest: only public
      whereClause = { visibility: "PUBLIC" };
    }
  }

  const questions = await prisma.question.findMany({
    where: { ...whereClause, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <>
      {ability.can("create", "Question") && (
        <a href="/questions/new">+ New Question</a>
      )}
      <ul>
        {questions.map((q) => (
          <li key={q.id}>{q.stem}</li>
        ))}
      </ul>
    </>
  );
}
```

### Caching Public Data with `use cache`

For public-facing content that doesn't need per-user filtering, use `"use cache"` to cache the result:

```tsx
import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

// This function is safe to cache — it returns the same data for everyone
async function getPublicSubjects() {
  "use cache";
  cacheLife("hours");
  cacheTag("subjects");

  return prisma.subject.findMany({
    orderBy: { name: "asc" },
  });
}
```

> [!CAUTION]
> Only use `"use cache"` on functions that return the **same data for all users**. Never cache anything that depends on `getSession()`, `cookies()`, or `headers()`.

### Future: `@casl/prisma` Integration

When `@casl/prisma` is added, the manual where-clause building is replaced:

```typescript
import { accessibleBy } from "@casl/prisma";

// Automatically generates Prisma WHERE clause from CASL rules
const questions = await prisma.question.findMany({
  where: accessibleBy(ability, "read").Question,
});
```

---

## 12. Server Actions with Permission Checks

Server Actions are the primary way to perform mutations from the frontend. Always validate permissions before executing.

> [!IMPORTANT]
> Per the [Next.js Data Security guide](https://nextjs.org/docs/app/guides/data-security): **A page-level authentication check does NOT extend to Server Actions.** Always re-verify auth inside every action — they are separate entry points callable via POST.

### Pattern: Protected Server Action

```typescript
// frontend/src/app/questions/actions.ts
"use server";

import { getAbility } from "@/lib/casl/get-ability";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";
import { subject } from "@casl/ability";
import { ForbiddenError } from "@casl/ability";
import { revalidatePath } from "next/cache";

export async function createQuestion(formData: FormData) {
  // 1. Authenticate
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // 2. Authorize (subject-level)
  const ability = await getAbility();
  ForbiddenError.from(ability).throwUnlessCan("create", "Question");

  // 3. Execute
  const question = await prisma.question.create({
    data: {
      stem: formData.get("stem") as string,
      type: formData.get("type") as string,
      createdById: Number(session.user.id),
      // ... other fields
    },
  });

  revalidatePath("/questions");
  return { success: true, id: question.id };
}

export async function deleteQuestion(questionId: number) {
  // 1. Authenticate
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // 2. Fetch the record
  const question = await prisma.question.findUniqueOrThrow({
    where: { id: questionId },
  });

  // 3. Authorize (instance-level — checks ownership)
  const ability = await getAbility();
  ForbiddenError.from(ability).throwUnlessCan(
    "delete",
    subject("Question", question),
  );

  // 4. Soft delete
  await prisma.question.update({
    where: { id: questionId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/questions");
}
```

### Using Server Actions in Components

```tsx
// frontend/src/app/questions/new/page.tsx
import { Suspense } from "react";
import { createQuestion } from "../actions";
import { getAbility } from "@/lib/casl/get-ability";
import { redirect } from "next/navigation";

export default function NewQuestionPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <NewQuestionForm />
    </Suspense>
  );
}

async function NewQuestionForm() {
  const ability = await getAbility();

  // Guard: redirect if user can't create questions
  if (!ability.can("create", "Question")) {
    redirect("/questions");
  }

  return (
    <form action={createQuestion}>
      <label htmlFor="stem">Question</label>
      <textarea id="stem" name="stem" required />

      <label htmlFor="type">Type</label>
      <select id="type" name="type">
        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
        <option value="OPEN_ENDED">Open Ended</option>
      </select>

      <button type="submit">Create Question</button>
    </form>
  );
}
```

---

## 13. Common Patterns

### 13.1 Permission-Based Navigation

```tsx
// Server Component — must be inside <Suspense> since it calls getAbility()
import { getAbility } from "@/lib/casl/get-ability";

export async function MainNav() {
  const ability = await getAbility();

  const navItems = [
    // Always visible
    { href: "/", label: "Home", visible: true },
    {
      href: "/questions",
      label: "Questions",
      visible: ability.can("read", "Question"),
    },

    // Teacher+ only
    {
      href: "/questions/new",
      label: "Create Question",
      visible: ability.can("create", "Question"),
    },
    {
      href: "/tests/new",
      label: "Create Test",
      visible: ability.can("create", "Test"),
    },
    {
      href: "/classes",
      label: "My Classes",
      visible: ability.can("create", "Class"),
    },

    // Moderator+ only
    {
      href: "/moderation",
      label: "Moderation",
      visible: ability.can("ban", "User"),
    },

    // Admin only
    {
      href: "/admin",
      label: "Admin",
      visible: ability.can("read", "AuditLog"),
    },
  ];

  return (
    <nav>
      {navItems
        .filter((item) => item.visible)
        .map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
    </nav>
  );
}
```

Usage in layout:

```tsx
// In a layout file
import { Suspense } from "react";
import { MainNav } from "@/components/MainNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<NavSkeleton />}>
        <MainNav />
      </Suspense>
      <main>{children}</main>
    </>
  );
}
```

### 13.2 `<Can>` Wrapper Component (Server)

A reusable Server Component for cleaner conditional rendering:

```tsx
// frontend/src/components/auth/Can.tsx
import { getAbility } from "@/lib/casl/get-ability";
import type { Actions, Subjects } from "@casl-shared/ability";

interface CanProps {
  action: Actions;
  subject: Subjects;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Server Component that conditionally renders children
 * based on the current user's CASL permissions.
 *
 * ⚠️ Must be used inside a <Suspense> boundary since
 *    it calls getAbility() which uses headers().
 *
 * Usage:
 *   <Suspense>
 *     <Can action="create" subject="Question">
 *       <CreateButton />
 *     </Can>
 *   </Suspense>
 */
export async function Can({
  action,
  subject,
  children,
  fallback = null,
}: CanProps) {
  const ability = await getAbility();

  if (ability.can(action, subject)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
```

### 13.3 Client-Side `<Can>` Component

```tsx
// frontend/src/components/auth/ClientCan.tsx
"use client";

import { useAbility } from "@/providers/AbilityProvider";
import type { Actions, Subjects } from "@casl-shared/ability";

interface ClientCanProps {
  action: Actions;
  subject: Subjects;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientCan({
  action,
  subject,
  children,
  fallback = null,
}: ClientCanProps) {
  const ability = useAbility();

  if (ability.can(action, subject)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
```

### 13.4 When to Use Frontend vs Backend

| Scenario                            | Where to query                         | Why                                   |
| ----------------------------------- | -------------------------------------- | ------------------------------------- |
| List public questions for SSR       | Frontend (Prisma + `"use cache"`)      | Fastest — cached in static shell      |
| User-specific content               | Frontend (Prisma, no cache)            | Per-request, wrapped in `<Suspense>`  |
| Create/update/delete content        | Server Action (frontend Prisma)        | Keeps it simple with `revalidatePath` |
| Complex business logic              | Backend API (fetch)                    | Keep complex workflows in one place   |
| User session / auth state           | Frontend (Better-Auth)                 | Always local — same DB                |
| Admin operations (ban, role change) | Backend API (Better-Auth admin plugin) | Admin plugin logic lives on backend   |

---

## 14. FAQ & Troubleshooting

### Q: Why share CASL definitions instead of using Better-Auth's `createAccessControl`?

Better-Auth's `createAccessControl` (currently in `auth-permissions.ts`) is a simpler string-based system designed for the admin plugin. CASL provides:

- **Condition-based rules** (e.g., `can("update", "Question", { createdById: user.id })`)
- **Instance-level checks** (check against actual database records)
- **Future `@casl/prisma` integration** (auto-generate Prisma WHERE clauses)

Keep `auth-permissions.ts` for the Better-Auth admin plugin only. Use CASL for everything else.

### Q: Can I use `getAbility()` in middleware.ts?

**No.** Next.js middleware runs on the Edge Runtime, which doesn't support Prisma or Node.js-specific APIs. Middleware should only check for session cookie existence. Use page-level `getAbility()` for role-based guards.

### Q: What about `getSession()` — should I use the `auth.api.getSession()` or the fetch-based approach?

Use `auth.api.getSession()` (local call). The fetch-based approach in `src/actions/getSession.ts` makes an HTTP round-trip to the backend, which is slower. Since the frontend has its own Better-Auth instance sharing the same database, the local call is both faster and simpler.

### Q: Do client-side permission checks provide security?

**No.** Client-side `useAbility()` checks are for **UX only** — hiding buttons and menu items users can't use. The actual security boundary is:

1. **Server Actions** — validate permissions before mutations
2. **Server Components** — validate before rendering sensitive data
3. **Backend API** — validate in Fastify middleware for backend-routed requests

### Q: When should I use `"use cache"` vs no cache?

| Content type                                     | Caching strategy                                              |
| ------------------------------------------------ | ------------------------------------------------------------- |
| Public content (subjects, published tests)       | `"use cache"` + `cacheLife("hours")` + `cacheTag("subjects")` |
| User-specific content (dashboard, own questions) | **No cache** — per-request inside `<Suspense>`                |
| Static UI chrome (header, footer, layout markup) | Automatically prerendered — no directive needed               |
| Auth-dependent data (session, ability)           | **Never cache** — use `React.cache()` for deduplication only  |

### Q: Can I use `"use cache"` on a component that renders differently per user?

**No.** `"use cache"` caches the component output by its props (cache key). If two users with different roles hit the same page, they'd see the same cached output. Auth-dependent rendering must be dynamic.

### Q: How does `React.cache()` differ from `"use cache"`?

| Feature                                   | `React.cache()`                      | `"use cache"`                        |
| ----------------------------------------- | ------------------------------------ | ------------------------------------ |
| Purpose                                   | Deduplicate calls within one request | Cache results across requests        |
| Persistence                               | Gone after request ends              | Persists with configured `cacheLife` |
| Can access `cookies()`/`headers()`        | ✅ Yes                               | ❌ No                                |
| Right for `getSession()` / `getAbility()` | ✅ Yes                               | ❌ Dangerous                         |

### Q: How do I add a new permission to the frontend?

1. Add the rule in `backend/src/auth/casl/roles/<role>.ts`
2. If using path aliases, the frontend picks it up automatically
3. If using the copy approach, copy the updated file to `frontend/src/lib/casl/roles/`
4. Use `ability.can("newAction", "NewSubject")` in your components

### Q: I get `Error: Uncached data was accessed outside of <Suspense>`

This means a component is calling a runtime API (`headers()`, `cookies()`) or fetching uncached data without being inside a `<Suspense>` boundary. Wrap it:

```tsx
// ❌ Error — getSession uses headers()
export default async function Page() {
  const session = await getSession(); // runtime API!
  return <div>{session?.user.name}</div>;
}

// ✅ Fixed — wrap in Suspense
export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <UserGreeting />
    </Suspense>
  );
}

async function UserGreeting() {
  const session = await getSession();
  return <div>{session?.user.name}</div>;
}
```

---

## File Summary

After implementing this guide, your frontend auth/CASL structure will look like:

```
frontend/src/
├── lib/
│   ├── auth/
│   │   ├── auth.ts               # Better-Auth server config (existing)
│   │   ├── auth-server.ts        # Better-Auth server config alt (existing)
│   │   ├── auth-client.ts        # Better-Auth client (existing)
│   │   ├── auth-permissions.ts   # Better-Auth admin AC (existing, keep for admin plugin)
│   │   ├── get-session.ts        # [NEW] Server-side session helper (server-only)
│   │   └── types.ts              # [NEW] Session/User type exports
│   ├── casl/
│   │   └── get-ability.ts        # [NEW] Per-request ability builder (React.cache)
│   └── prisma.ts                 # Prisma client (existing)
├── providers/
│   └── AbilityProvider.tsx       # [NEW] Client-side ability context
├── components/
│   └── auth/
│       ├── Can.tsx               # [NEW] Server-side conditional render
│       └── ClientCan.tsx         # [NEW] Client-side conditional render
├── middleware.ts                 # [NEW] Route protection (Edge, cookie-only)
└── app/
    └── layout.tsx                # [MODIFY] Wrap with <Suspense> + AbilityProvider
```
