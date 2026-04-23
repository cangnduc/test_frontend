import { z } from "zod";
import { AttemptStatus, SectionStatus, SelectionMode } from "./common";

export const TestAttemptSchema = z.object({
  id: z.string().uuid(),
  userId: z.number().int(),
  testId: z.string().uuid(),
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
  configSnapshot: z.any(),
  sessionToken: z.string().nullable(),
  clientFingerprint: z.string().nullable(),
  ipAddress: z.string().nullable(),
});

export const AttemptSectionSchema = z.object({
  id: z.string().uuid(),
  attemptId: z.string().uuid(),
  sectionId: z.string().uuid(),
  order: z.number().int(),
  title: z.string(),
  timeLimit: z.number().int().nullable(),
  selectionMode: SelectionMode.nullable(),
  requiredAnswerCount: z.number().int().nullable(),
  status: SectionStatus,
  startedAt: z.date().nullable(),
  sectionEndAt: z.date().nullable(),
  completedAt: z.date().nullable(),
});

export const AttemptQuestionSchema = z.object({
  id: z.string().uuid(),
  attemptId: z.string().uuid(),
  attemptSectionId: z.string().uuid(),
  questionId: z.string().uuid(),
  displayOrder: z.number().int(),
  point: z.number().int(),
  isRequired: z.boolean(),
  testQuestionId: z.string().uuid().nullable(),
});

export const AttemptAnswerSchema = z.object({
  id: z.string().uuid(),
  attemptId: z.string().uuid(),
  attemptQuestionId: z.string().uuid(),
  questionId: z.string().uuid(),
  response: z.any(),
  version: z.number().int(),
  isCorrect: z.boolean().nullable(),
  pointsAwarded: z.number(),
  savedAt: z.date(),
  updatedAt: z.date(),
});

export const ManualGradeSchema = z.object({
  id: z.string().uuid(),
  attemptAnswerId: z.string().uuid(),
  gradedById: z.number().int(),
  pointsAwarded: z.number(),
  feedback: z.string().nullable(),
  gradedAt: z.date(),
  updatedAt: z.date(),
});

// Request schemas
export const PostAnswerSchema = z.object({
  attemptQuestionId: z.string().uuid(),
  response: z.any(),
});

export const StartAttemptSchema = z.object({
  testId: z.string().uuid(),
});
