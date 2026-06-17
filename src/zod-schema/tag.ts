import { z } from "zod";

// ─── Model Schemas (match Prisma models) ─────────────────────

/** Centralized tag vocabulary for classifying content */
export const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  color: z.string().nullable(),
  description: z.string().nullable(),
  type: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** Junction: QuestionVersion ↔ Tag */
export const QuestionTagSchema = z.object({
  tagId: z.string().uuid(),
  questionVersionId: z.string().uuid(),
});

/** Junction: TestVersion ↔ Tag */
export const TestTagSchema = z.object({
  tagId: z.string().uuid(),
  testVersionId: z.string().uuid(),
});

/** Junction: PassageVersion ↔ Tag */
export const PassageTagSchema = z.object({
  tagId: z.string().uuid(),
  passageVersionId: z.string().uuid(),
});

// ─── Request Schemas ─────────────────────────────────────────

export const CreateTagSchema = z.object({
  name: z.string().trim().min(1),
  color: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
});

export const UpdateTagSchema = CreateTagSchema.partial();
