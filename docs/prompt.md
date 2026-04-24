I am building the frontend for a Question Route in a Next.js application.

## Goal

Create documentation and implementation planning for the Question Routes, including:

- Create Question
- Edit Question
- Update Question

The backend integration via Server Actions will be implemented later, so for now focus only on frontend architecture, form handling, state management, component structure, validation flow, and scalability.

---

## Existing Inputs

I will provide:

- Database schema
- Zod validators (located in `/zod-schema` folder)

Use those as the source of truth for types, validation, and form structure.

---

## Tech Stack

Use:

- Next.js (App Router)
- TypeScript
- React Hook Form
- Zod Resolver
- Zustand (for temporary draft state persistence)
- TailwindCSS (if UI examples are needed)

---

## Question Complexity

A Question can contain:

- Nested objects
- Deeply nested arrays
- Conditional fields
- Multiple question types
- Dynamic sections depending on question type
- Reusable substructures

Because of this complexity:

- Split each logical section into its own component
- Prevent unnecessary re-renders
- Keep form maintainable and scalable
- Prefer modular composition over one large form component

---

## Required Planning Output

Provide a complete frontend implementation plan covering:

### 1. Folder Structure

Suggest scalable structure for:

- `/app/questions/create`
- `/app/questions/[id]/edit`
- `/components/question-form/*`
- `/stores/*`
- `/lib/*`

### 2. Form Architecture

Recommend how to structure:

- Root `QuestionForm`
- Nested section components
- Field arrays
- Deep nested object inputs
- Shared components between Create/Edit

### 3. React Hook Form Strategy

Explain:

- `useForm`
- `FormProvider`
- `useFormContext`
- `useFieldArray`
- `Controller` (when needed)
- defaultValues hydration
- partial reset
- dirty state handling

### 4. Validation Strategy

Use provided Zod schemas.

Explain:

- create vs edit schema differences
- dynamic validation by question type
- nested array validation
- custom refine/superRefine usage
- mapping backend errors later

### 5. Zustand Strategy

Use Zustand to persist unsaved draft state when:

- switching question types
- navigating tabs/steps
- accidental route change
- page refresh (optional localStorage)

Need recommendations for:

- store shape
- syncing RHF ↔ Zustand
- clearing state after submit
- avoiding duplicate sources of truth

### 6. Performance Optimization

Because form is large and nested, optimize for:

- prevent whole-form re-renders
- memoized section components
- selective watch usage
- lazy loaded sections
- useFieldArray best practices
- virtualization if large arrays
- debounced autosave

### 7. UX Recommendations

Need suggestions for:

- autosave draft
- unsaved changes warning
- stepper/tab navigation
- validation summary
- inline nested errors
- duplicate/delete array item confirmation
- loading/skeleton states

### 8. Edge Cases

Consider:

- switching question type with incompatible data
- removing nested array items
- server-loaded edit data shape mismatch
- stale schema versions
- partially saved drafts
- concurrent edits
- large payload performance
- hydration mismatch in Next.js
- browser refresh during editing

### 9. Future Backend Integration

Prepare architecture so later I can plug in:

- Server Actions
- optimistic update
- toast notifications
- server validation errors
- redirect after save

### 10. Deliverables

Return:

1. High-level architecture plan
2. Recommended folder structure
3. State flow diagram
4. Example component tree
5. RHF + Zustand integration pattern
6. Common pitfalls to avoid
7. Suggested implementation order

Important: prioritize maintainability, performance, and scalability.
