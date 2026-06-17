import { z } from "zod";
import { ClassRole } from "./common";

// ─── Model Schemas (match Prisma models) ─────────────────────

/** A virtual or physical classroom group */
export const ClassSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  code: z.string(),
  isActive: z.boolean(),
  teacherId: z.number().int(),
  subjectId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** A user's participation in a class */
export const ClassEnrollmentSchema = z.object({
  id: z.string().uuid(),
  classId: z.string().uuid(),
  userId: z.number().int(),
  role: ClassRole,
  isActive: z.boolean(),
  joinedAt: z.date(),
  leftAt: z.date().nullable(),
  updatedAt: z.date(),
});

/** A test version assigned to a class with scheduling and deadline */
export const ClassTestAssignmentSchema = z.object({
  id: z.string().uuid(),
  classId: z.string().uuid(),
  testId: z.string().uuid(),
  testVersionId: z.string().uuid(),
  availableFrom: z.date().nullable(),
  availableTo: z.date().nullable(),
  dueAt: z.date().nullable(),
  instructions: z.string().nullable(),
  isLateAllowed: z.boolean(),
  latePenaltyPercent: z.number().int().nullable(),
  assignedById: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ─── Request Schemas ─────────────────────────────────────────

export const CreateClassSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  subjectId: z.string().uuid().optional(),
});

export const UpdateClassSchema = CreateClassSchema.partial();

export const AssignTestToClassSchema = z.object({
  classId: z.string().uuid(),
  testId: z.string().uuid(),
  testVersionId: z.string().uuid(),
  availableFrom: z.coerce.date().optional(),
  availableTo: z.coerce.date().optional(),
  dueAt: z.coerce.date().optional(),
  instructions: z.string().optional(),
  isLateAllowed: z.boolean().optional(),
  latePenaltyPercent: z.number().int().optional(),
});
