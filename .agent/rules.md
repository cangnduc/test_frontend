# Frontend Agent Rules: Next.js 16 App Router

## 🚀 Next.js 16 Specific Rules

- **Async Components:** `params` and `searchParams` in `layout.tsx` and `page.tsx` are PROMISES. You MUST await them.
- **Data Fetching:** Fetch in Server Components by default. Use `Suspense` for loading states.
- **Server Actions:** Use `use server` for all mutations (forms, buttons). Place them in an `actions/` folder or within the component file if unique.

## 🎨 UI & Styling (Vanilla CSS / Tailwind)

- **Glassmorphism & Rich Design:** Follow the prompt requirements for "WOW" factors—use gradients, smooth shadows, and micro-animations.
- **Modern Layouts:** Use CSS Grid and Flexbox for responsiveness.
- **Icons:** Prefer modern SVG-based icon libraries (Lucide-React or similar).

## 🧩 Component Standards

- **Server First:** Every component is a Server Component by default. Use `'use client'` ONLY for interactivity or browser hooks.
- **Naming:** use `PascalCase` for component files (e.g., `UserCard.tsx`).
- **Exports:** Use named exports (`export const Component = ...`) instead of `default export`.
- **Props:** Always define a `[ComponentName]Props` interface.

## 🛠️ State Management

- **URL First:** Use search parameters for filter/search/sort state whenever possible.
- **Server State:** Use `useCache` or the built-in Next.js fetch cache where applicable.

## 📚 Documentation Requirement

- **Local Docs:** Before implementing new Next.js patterns, read `node_modules/next/dist/docs/`. Do not rely on training data for Next.js 16+ features.
