import { z } from "zod";

import {
  QuestionSchema,
  QuestionVersionSchema,
  CreateQuestionSchema,
  UpdateQuestionVersionSchema,
} from "@/zod-schema/question/index";
import { QuestionType, DifficultyLevel, Visibility } from "@/zod-schema/common";

export const QuestionParamsSchema = z.object({
  id: z.string().uuid("Invalid question ID"),
});

export const QuestionVersionParamsSchema = QuestionParamsSchema.extend({
  versionId: z.string().uuid("Invalid version ID"),
});

export const QuestionListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  subjectId: z.string().uuid().optional(),
  type: QuestionType.optional(),
  difficulty: DifficultyLevel.optional(),
  visibility: Visibility.optional(),
  tagIds: z.string().optional(), // Comma-separated IDs
  sortBy: z
    .enum(["createdAt", "updatedAt", "difficulty", "version"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  includeDeleted: z.coerce.boolean().default(false),
});

// ─── Create/Update Body ─────────────────────────────────────

export const CreateQuestionBodySchema = CreateQuestionSchema;

/** Update body (content fields only, subjectId cannot change) */
export const UpdateQuestionBodySchema = UpdateQuestionVersionSchema;

// ─── Response Schemas ────────────────────────────────────────

/** Full question with its current version and tags */
export const QuestionDetailResponseSchema = QuestionSchema.extend({
  currentVersion: QuestionVersionSchema.nullable(),
  tags: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  subject: z.object({ id: z.string(), name: z.string() }).optional(),
});

export const QuestionListResponseSchema = z.array(QuestionDetailResponseSchema);

// ─── Types ───────────────────────────────────────────────────

export type CreateQuestionBody = z.infer<typeof CreateQuestionBodySchema>;
export type UpdateQuestionBody = z.infer<typeof UpdateQuestionBodySchema>;
export type QuestionListQuery = z.infer<typeof QuestionListQuerySchema>;
export type QuestionParams = z.infer<typeof QuestionParamsSchema>;
export type QuestionVersionParams = z.infer<typeof QuestionVersionParamsSchema>;
