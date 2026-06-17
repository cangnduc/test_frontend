import { z } from "zod";
import { HomeworkStatus, SubmissionStatus } from "./common";

// ─── Model Schemas (match Prisma models) ─────────────────────

/** A task assigned to a class */
export const HomeworkAssignmentSchema = z.object({
  id: z.string().uuid(),
  classId: z.string().uuid(),
  createdById: z.number().int(),
  title: z.string(),
  description: z.string().nullable(),
  dueAt: z.date().nullable(),
  isLateAllowed: z.boolean(),
  latePenaltyPercent: z.number().int().nullable(),
  maxScore: z.number().nullable(),
  status: HomeworkStatus,
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** A student's submission for a homework task */
export const HomeworkSubmissionSchema = z.object({
  id: z.string().uuid(),
  homeworkId: z.string().uuid(),
  studentId: z.number().int(),
  content: z.string().nullable(),
  score: z.number().nullable(),
  feedback: z.string().nullable(),
  gradedById: z.number().int().nullable(),
  gradedAt: z.date().nullable(),
  submittedAt: z.date(),
  isLate: z.boolean(),
  attemptNumber: z.number().int(),
  status: SubmissionStatus,
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** A file attached to a homework submission */
export const SubmissionFileSchema = z.object({
  id: z.string().uuid(),
  submissionId: z.string().uuid(),
  mediaId: z.string(),
  label: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ─── Request Schemas ─────────────────────────────────────────

export const CreateHomeworkSchema = z.object({
  classId: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  dueAt: z.coerce.date().optional(),
  isLateAllowed: z.boolean().optional(),
  latePenaltyPercent: z.number().int().optional(),
  maxScore: z.number().optional(),
});

export const SubmitHomeworkSchema = z.object({
  homeworkId: z.string().uuid(),
  content: z.string().optional(),
});

export const GradeHomeworkSchema = z.object({
  score: z.number(),
  feedback: z.string().optional(),
});
