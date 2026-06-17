import { z } from "zod";
import { PassageType, DifficultyLevel, Visibility } from "./common";

// ─── Model Schemas (match Prisma models) ─────────────────────

/** Logical container for a passage — references the active version */
export const PassageSchema = z.object({
  id: z.string().uuid(),
  subjectId: z.string().uuid(),
  createdById: z.number().int().nullable(),
  currentVersionId: z.string().uuid().nullable(),
  deletedAt: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** Immutable snapshot of a passage's content */
export const PassageVersionSchema = z.object({
  id: z.string().uuid(),
  passageId: z.string().uuid(),
  version: z.number().int(),
  type: PassageType,
  title: z.string(),
  content: z.string(),
  difficulty: DifficultyLevel,
  visibility: Visibility,
  explanation: z.string().nullable(),
  createdById: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ─── Request Schemas ─────────────────────────────────────────

export const CreatePassageVersionSchema = z.object({
  passageId: z.string().uuid().optional(),
  subjectId: z.string().uuid(),
  type: PassageType,
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
  difficulty: DifficultyLevel.optional(),
  visibility: Visibility.optional(),
  explanation: z.string().trim().min(1).optional(),
});

export const UpdatePassageVersionSchema = CreatePassageVersionSchema.omit({
  passageId: true,
  subjectId: true,
}).partial();
