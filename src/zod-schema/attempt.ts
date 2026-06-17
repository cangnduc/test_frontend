import { z } from "zod";
import { AttemptStatus, SectionStatus } from "./common";
import { AttemptResponseSchema, QuestionResponseSchema } from "./question";

// ─── Model Schemas (match Prisma models) ─────────────────────

/** A student's instance of taking a specific test version */
export const TestAttemptSchema = z.object({
  id: z.string().uuid(),
  userId: z.number().int(),
  testId: z.string().uuid(),
  testVersionId: z.string().uuid(),
  status: AttemptStatus,
  attemptNumber: z.number().int(),
  startedAt: z.date(),
  submittedAt: z.date().nullable(),
  completedAt: z.date().nullable(),
  globalEndAt: z.date().nullable(),
  currentSectionId: z.string().uuid().nullable(),
  totalScore: z.number().nullable(),
  maxScore: z.number().nullable(),
  percentage: z.number().nullable(),
  passed: z.boolean().nullable(),
  configSnapshot: z.any().nullable(),
  sessionToken: z.string().nullable(),
  clientFingerprint: z.string().nullable(),
  ipAddress: z.string().nullable(),
  deviceType: z.string().nullable(),
  browserInfo: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** Tracking record for a student's progress through a test section */
export const AttemptSectionSchema = z.object({
  id: z.string().uuid(),
  attemptId: z.string().uuid(),
  testVersionSectionId: z.string().uuid(),
  status: SectionStatus,
  startedAt: z.date().nullable(),
  sectionEndAt: z.date().nullable(),
  completedAt: z.date().nullable(),
  updatedAt: z.date(),
});

/** A specific question served to a student in an attempt */
export const AttemptQuestionSchema = z.object({
  id: z.string().uuid(),
  attemptId: z.string().uuid(),
  attemptSectionId: z.string().uuid(),
  questionVersionId: z.string().uuid(),
  testVersionQuestionId: z.string().uuid().nullable(),
  displayOrder: z.number().int(),
  point: z.number().int(),
  isRequired: z.boolean(),
  updatedAt: z.date(),
});

/** A student's response to an attempt question */
export const AttemptAnswerSchema = z.object({
  id: z.string().uuid(),
  attemptId: z.string().uuid(),
  attemptQuestionId: z.string().uuid(),
  questionVersionId: z.string().uuid(),
  response: QuestionResponseSchema,
  pointsAwarded: z.number(),
  isCorrect: z.boolean().nullable(),
  savedAt: z.date(),
  updatedAt: z.date(),
});

/** Manual grading action by a teacher/admin */
export const ManualGradeSchema = z.object({
  id: z.string().uuid(),
  attemptAnswerId: z.string().uuid(),
  gradedById: z.number().int(),
  pointsAwarded: z.number(),
  feedback: z.string().nullable(),
  gradedAt: z.date(),
  updatedAt: z.date(),
});

// ─── Request Schemas ─────────────────────────────────────────

export const PostAnswerSchema = z.object({
  attemptQuestionId: z.string().uuid(),
  response: AttemptResponseSchema,
});

export const StartAttemptSchema = z.object({
  testId: z.string().uuid(),
});

export const SubmitManualGradeSchema = z.object({
  attemptAnswerId: z.string().uuid(),
  pointsAwarded: z.number(),
  feedback: z.string().optional(),
});
