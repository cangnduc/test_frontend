import { z } from "zod";
import {
  PublishStatus,
  DifficultyLevel,
  ResultViewType,
  SectionType,
  SelectionMode
} from "./common";

// ─── Model Schemas (match Prisma models) ─────────────────────

/** Logical container for an assessment */
export const TestSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  isArchived: z.boolean(),
  subjectId: z.string().uuid(),
  createdById: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** Immutable snapshot of a test's configuration */
export const TestVersionSchema = z.object({
  id: z.string().uuid(),
  testId: z.string().uuid(),
  version: z.number().int(),
  status: PublishStatus,
  tokenRequired: z.number().int(),
  difficulty: DifficultyLevel,
  coverMediaId: z.string().uuid().nullable(),
  createdById: z.number().int(),
  availableFrom: z.date(),
  availableTo: z.date().nullable(),
  duration: z.number().int().nullable(),
  maxAttempts: z.number().int().nullable(),
  shuffleQuestions: z.boolean().nullable(),
  showResultImmediately: z.boolean().nullable(),
  requirePassword: z.string().nullable(),
  ipRestriction: z.string().nullable(),
  strictMode: z.boolean().nullable(),
  forwardOnly: z.boolean().nullable(),
  passingPercentage: z.number().int().nullable(),
  resultView: ResultViewType.nullable(),
  publishedAt: z.date().nullable(),
  archivedAt: z.date().nullable(),
  changelog: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** A structural block within a TestVersion */
export const TestVersionSectionSchema = z.object({
  id: z.string().uuid(),
  testVersionId: z.string().uuid(),
  type: SectionType,
  title: z.string(),
  order: z.number().int(),
  description: z.string().nullable(),
  timeLimit: z.number().int().nullable(),
  questionSelectionMode: SelectionMode,
  questionToSelect: z.number().int().nullable(),
  passageVersionId: z.string().uuid().nullable(),
  updatedAt: z.date(),
});

/** Link record placing a QuestionVersion into a TestVersionSection */
export const TestVersionQuestionSchema = z.object({
  id: z.string().uuid(),
  testVersionSectionId: z.string().uuid(),
  questionId: z.string().uuid(),
  questionVersionId: z.string().uuid(),
  order: z.number().int(),
  point: z.number().int(),
  updatedAt: z.date(),
});

// ─── Request Schemas ─────────────────────────────────────────

export const CreateTestSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  subjectId: z.string().uuid(),
});

export const CreateTestVersionSchema = z.object({
  testId: z.string().uuid(),
  status: PublishStatus.optional(),
  tokenRequired: z.number().int().optional(),
  difficulty: DifficultyLevel.optional(),
  availableFrom: z.coerce.date().optional(),
  availableTo: z.coerce.date().optional(),
  duration: z.number().int().optional(),
  maxAttempts: z.number().int().optional(),
  shuffleQuestions: z.boolean().optional(),
  showResultImmediately: z.boolean().optional(),
  requirePassword: z.string().optional(),
  ipRestriction: z.string().optional(),
  strictMode: z.boolean().optional(),
  forwardOnly: z.boolean().optional(),
  passingPercentage: z.number().int().optional(),
  resultView: ResultViewType.optional(),
  changelog: z.string().optional(),
});

export const CreateTestSectionSchema = z.object({
  testVersionId: z.string().uuid(),
  type: SectionType,
  title: z.string(),
  order: z.number().int(),
  description: z.string().optional(),
  timeLimit: z.number().int().optional(),
  questionSelectionMode: SelectionMode.optional(),
  questionToSelect: z.number().int().optional(),
  passageVersionId: z.string().uuid().optional(),
});
