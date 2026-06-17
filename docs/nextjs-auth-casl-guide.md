# Next.js Auth & CASL Permission Guide

> **Stack:** Next.js 16 (App Router, Cache Components) · React 19 · Better-Auth · CASL · Prisma  
> **Last updated:** 2026-06-11  

---

## Table of Contents

1. [Overview](#1-overview)
2. [Directory Structure](#2-directory-structure)
3. [Next.js 16 & React 19 Caching Model](#3-nextjs-16--react-19-caching-model)
4. [Server-Side Integration](#4-server-side-integration)
   - [Getting the Session](#getting-the-session)
   - [Building the Ability](#building-the-ability)
   - [Conditional Rendering in Server Components](#conditional-rendering-in-server-components)
   - [Server Actions with Permission Checks](#server-actions-with-permission-checks)
5. [Client-Side Integration](#5-client-side-integration)
   - [AbilityProvider & useAbility Hook](#abilityprovider--useability-hook)
   - [Usage in Client Components](#usage-in-client-components)
6. [Route & Page Protection](#6-route--page-protection)
   - [Next.js Middleware (Cookie check)](#nextjs-middleware-cookie-check)
   - [Page-Level Guard Pattern](#page-level-guard-pattern)
7. [Direct Database Queries with CASL](#7-direct-database-queries-with-casl)
8. [Common Patterns & Helper Components](#8-common-patterns--helper-components)
9. [FAQ & Troubleshooting](#9-faq--troubleshooting)

---

## 1. Overview

The frontend architecture implements authentication (who is this?) via **Better-Auth** and authorization (what can they do?) via **CASL**. 

To guarantee consistency, the frontend uses the **exact same CASL ability rules and roles** as the backend.

| Concern | Responsibility | Location |
| :--- | :--- | :--- |
| **Authentication** | Better-Auth | `src/auth/auth.ts`, `src/auth/auth-server.ts`, `src/auth/auth-client.ts` |
| **Authorization** | CASL | `src/auth/casl/` (defines roles/rules, evaluates capabilities) |
| **Data Access** | Prisma | `src/lib/prisma.ts` (direct queries from Server Components & Actions) |

---

## 2. Directory Structure

All auth-related files live under `src/auth/` and `src/actions/`:

```
frontend/src/
├── actions/
│   └── getSession.ts         # Server-side per-request session fetcher (cached)
├── auth/
│   ├── auth.ts               # Better-Auth general config & types
│   ├── auth-server.ts        # Better-Auth server-specific adapter/plugins
│   ├── auth-client.ts        # Better-Auth client SDK (for login/logout)
│   ├── auth-permissions.ts   # Better-Auth admin role rules (string-based)
│   └── casl/
│       ├── ability.ts        # CASL AppAbility definition (Actions & Subjects)
│       ├── get-ability.ts    # Server helper building request-scoped CASL abilities
│       ├── types.ts          # Lean user interface for permission checks
│       └── roles/
│           ├── index.ts      # Combines role definitions & guest/banned checks
│           ├── guest.ts      # Public permissions
│           ├── student.ts    # Student role permissions
│           ├── teacher.ts    # Teacher role permissions
│           ├── moderator.ts  # Moderator role permissions
│           ├── admin.ts      # Admin role permissions
│           └── parent.ts     # Parent role permissions
```

> [!WARNING]
> Since CASL rules are copied into the frontend to enable instant, zero-network permission checks, **any permission modifications in the backend must be replicated here** in `frontend/src/auth/casl/roles/`.

---

## 3. Next.js 16 & React 19 Caching Model

Implementing authentication and permissions in Next.js 16 requires strict adherence to its rendering and caching paradigms:

1. **`React.cache()`**: Deduplicates operations *within a single request lifecycle*. Perfect for `getSession` and `getAbility` to ensure they execute at most once per page render.
2. **`use cache: private`**: Opts a function into caching user-specific data across rendering passes, bound to a specific session.
3. **No Caching for Auth/Ability builders**: **Never** put `"use cache"` (global/shared) on session or ability builders. Doing so would leak one user's state to another.
4. **Prerendering & Dynamic APIs**: Calling `headers()` or `cookies()` marks a component as dynamic. Wrap these components in `<Suspense>` boundaries.

---

## 4. Server-Side Integration

### Getting the Session

Use the `getSession()` helper to retrieve the authenticated user on the server.

```typescript
// frontend/src/actions/getSession.ts
import "server-only";
import { headers } from "next/headers";
import { auth } from "@/auth/auth";
import { cache } from "react";
import { cacheLife } from "next/cache";

/**
 * Retrieves the current session. Cached privately per-user request.
 * Since this accesses headers(), any component calling it is dynamic and
 * should be wrapped in a <Suspense> boundary.
 */
export const getSession = cache(async () => {
  "use cache: private";
  cacheLife("minutes");

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
});
```

### Building the Ability

Use the `getAbility()` helper to load the request-scoped ability.

```typescript
// frontend/src/auth/casl/get-ability.ts
import "server-only";
import { cache } from "react";
import { getSession } from "@/actions/getSession";
import { defineAbilityFor } from "@/auth/casl/roles";
import type { AppAbility } from "@/auth/casl/ability";
import type { AppUser } from "@/auth/casl/types";

/**
 * Builds the CASL ability for the current request context.
 * Uses React.cache() to deduplicate execution across the render pass.
 */
export const getAbility = cache(async (): Promise<AppAbility> => {
  const session = await getSession();

  if (!session?.user) {
    return defineAbilityFor(undefined); // Guest permissions
  }

  const user: AppUser = {
    id: session.user.id,
    role: (session.user.role as AppUser["role"]) ?? "USER",
    banned: session.user.banned ?? false,
  };

  return defineAbilityFor(user);
});
```

### Conditional Rendering in Server Components

Since `getAbility()` is a dynamic API (calls `headers()`), keep pages dynamic or wrap permission-checked components in `<Suspense>` to enable Partial Prerendering (PPR).

```tsx
// frontend/src/app/questions/page.tsx
import { Suspense } from "react";
import { getAbility } from "@/auth/casl/get-ability";

export default function QuestionsPage() {
  return (
    <div>
      <h1>Question Bank</h1>
      <Suspense fallback={<div>Loading options...</div>}>
        <ActionBar />
      </Suspense>
    </div>
  );
}

async function ActionBar() {
  const ability = await getAbility();

  return (
    <div>
      {ability.can("create", "Question") && (
        <a href="/questions/new" className="btn">Create Question</a>
      )}
      {ability.can("read", "SystemLog") && (
        <a href="/admin/logs" className="btn">Logs</a>
      )}
    </div>
  );
}
```

### Server Actions with Permission Checks

Next.js Server Actions are independent HTTP POST endpoints. **Always re-verify authentication and permissions inside every action.**

```typescript
// frontend/src/app/questions/actions.ts
"use server";

import { getAbility } from "@/auth/casl/get-ability";
import { getSession } from "@/actions/getSession";
import { prisma } from "@/lib/prisma";
import { subject, ForbiddenError } from "@casl/ability";
import { revalidatePath } from "next/cache";

export async function deleteQuestion(questionId: number) {
  // 1. Authenticate
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // 2. Fetch resource to verify instance-level permissions (e.g. ownership)
  const question = await prisma.question.findUniqueOrThrow({
    where: { id: questionId },
  });

  // 3. Authorize
  const ability = await getAbility();
  ForbiddenError.from(ability).throwUnlessCan("delete", subject("Question", question));

  // 4. Perform mutation
  await prisma.question.update({
    where: { id: questionId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/questions");
}
```

---

## 5. Client-Side Integration

Client Components cannot execute `getAbility()` directly since it relies on server-only packages. We must serialize the CASL rules on the server and pass them to the client to build a local ability.

### AbilityProvider & useAbility Hook

Create a React Context provider to share the instantiated ability across client components:

```tsx
// frontend/src/providers/AbilityProvider.tsx
"use client";

import { createContext, useContext } from "react";
import { createMongoAbility, type RawRuleOf } from "@casl/ability";
import type { AppAbility } from "@/auth/casl/ability";

const AbilityContext = createContext<AppAbility | null>(null);

interface AbilityProviderProps {
  rules: RawRuleOf<AppAbility>[];
  children: React.ReactNode;
}

export function AbilityProvider({ rules, children }: AbilityProviderProps) {
  // React 19 auto-memoizes context values and components — no useMemo needed
  const ability = createMongoAbility<AppAbility>(rules);

  return (
    <AbilityContext value={ability}>
      {children}
    </AbilityContext>
  );
}

export function useAbility(): AppAbility {
  const ability = useContext(AbilityContext);
  if (!ability) {
    throw new Error("useAbility must be used within an <AbilityProvider>");
  }
  return ability;
}
```

### Hydrating the Provider in Layouts

Fetch rules in a Server Component layout and pass them down:

```tsx
// frontend/src/app/layout.tsx
import { Suspense } from "react";
import { getAbility } from "@/auth/casl/get-ability";
import { AbilityProvider } from "@/providers/AbilityProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div>Loading Layout...</div>}>
          <AuthHydrator>{children}</AuthHydrator>
        </Suspense>
      </body>
    </html>
  );
}

async function AuthHydrator({ children }: { children: React.ReactNode }) {
  const ability = await getAbility();
  return (
    <AbilityProvider rules={ability.rules}>
      {children}
    </AbilityProvider>
  );
}
```

### Usage in Client Components

```tsx
"use client";

import { useAbility } from "@/providers/AbilityProvider";

export function EditQuestionButton({ question }: { question: any }) {
  const ability = useAbility();

  // client-side check determines only if the button renders
  if (!ability.can("update", "Question")) return null;

  return <button onClick={() => openEditModal(question)}>Edit</button>;
}
```

> [!CAUTION]
> Client-side permission checks are for **UX convenience only**. They are easily bypassed by users. All security boundaries must be strictly enforced on the server (Server Actions, API endpoints).

---

## 6. Route & Page Protection

### Next.js Middleware (Cookie check)

Next.js Middleware runs on the Edge runtime and lacks direct DB access. It should only verify the presence of the session cookie to restrict path access generally.

```typescript
// frontend/src/middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedPaths = ["/dashboard", "/questions", "/admin", "/profile"];
const authPaths = ["/login", "/sign-up"];

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = !!sessionCookie;
  const { pathname } = request.nextUrl;

  if (!isAuthenticated && protectedPaths.some((p) => pathname.startsWith(p))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && authPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
```

### Page-Level Guard Pattern

Role-based or permission-based route authorization should be executed inside the layout or page component.

```tsx
// frontend/src/app/admin/layout.tsx
import { redirect } from "next/navigation";
import { getAbility } from "@/auth/casl/get-ability";
import { getSession } from "@/actions/getSession";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const ability = await getAbility();
  if (!ability.can("read", "AuditLog")) {
    redirect("/dashboard"); // Unauthorized
  }

  return <>{children}</>;
}
```

---

## 7. Direct Database Queries with CASL

Because the Next.js frontend has direct read/write access to the database via Prisma, you can write database queries filtered dynamically according to user authorization.

```typescript
import { prisma } from "@/lib/prisma";
import { getAbility } from "@/auth/casl/get-ability";
import { getSession } from "@/actions/getSession";

export async function getFilteredQuestions() {
  const ability = await getAbility();
  const session = await getSession();

  let filter: any = { deletedAt: null };

  if (!ability.can("manage", "all")) {
    // If not admin, restrict based on role capability
    if (ability.can("create", "Question") && session) {
      // Teachers: own questions + public questions
      filter.OR = [
        { visibility: "PUBLIC" },
        { createdById: Number(session.user.id) }
      ];
    } else {
      // Students / Guests: only public questions
      filter.visibility = "PUBLIC";
    }
  }

  return prisma.question.findMany({
    where: filter,
    orderBy: { createdAt: "desc" }
  });
}
```

---

## 8. Common Patterns & Helper Components

### Server-Side `<Can>` Component

A clean wrapper for wrapping sections in Server Components:

```tsx
// frontend/src/components/auth/Can.tsx
import { getAbility } from "@/auth/casl/get-ability";
import type { Actions, Subjects } from "@/auth/casl/ability";

interface CanProps {
  action: Actions;
  subject: Subjects;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export async function Can({ action, subject, children, fallback = null }: CanProps) {
  const ability = await getAbility();

  if (ability.can(action, subject)) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
}
```

Usage:
```tsx
import { Suspense } from "react";
import { Can } from "@/components/auth/Can";

export default function AdminToolbar() {
  return (
    <Suspense fallback={<div>Loading tools...</div>}>
      <Can action="read" subject="AuditLog">
        <button>View Audit Logs</button>
      </Can>
    </Suspense>
  );
}
```

### Client-Side `<ClientCan>` Component

```tsx
// frontend/src/components/auth/ClientCan.tsx
"use client";

import { useAbility } from "@/providers/AbilityProvider";
import type { Actions, Subjects } from "@/auth/casl/ability";

interface ClientCanProps {
  action: Actions;
  subject: Subjects;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientCan({ action, subject, children, fallback = null }: ClientCanProps) {
  const ability = useAbility();

  if (ability.can(action, subject)) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
}
```

---

## 9. FAQ & Troubleshooting

### Q: Why use `React.cache()` for `getSession` and `getAbility` instead of Next.js `"use cache"`?
* **`React.cache()`** deduplicates calls *within a single request render*. It is request-specific and doesn't persist data across users.
* **`"use cache"`** is a global cross-request cache. It behaves like a static file. Caching `getSession` or `getAbility` globally would leak authentication and authorization state between users.

### Q: Should I use `auth.api.getSession()` directly or fetch the session via an HTTP action?
Use the local `auth.api.getSession()` API (wrapped inside `getSession()`). Since Better-Auth accesses the database directly on the server, fetching it locally is much faster than doing an HTTP fetch roundtrip to the API router.

### Q: How do I handle instance-level validation (e.g. checking if a user owns a question)?
CASL Mongo-style conditions require matching object properties. When executing an action, retrieve the database record first, and check permissions against the record wrapped in `subject()`:
```typescript
import { subject } from "@casl/ability";
// ...
const question = await prisma.question.findUnique({ where: { id } });
if (ability.cannot("update", subject("Question", question))) {
  throw new Error("Unauthorized");
}
```

### Q: Why not perform CASL validation in `middleware.ts`?
Next.js Middleware runs on the Edge runtime which has limitations (e.g. no database connections, limited Node.js API support). Edge middleware should only check cookies for general route access. Deep, role-based, or resource-based authorization belongs in page components or layouts.
