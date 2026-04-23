import { z } from "zod";
import { ClassRole } from "./common";

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

export const ClassEnrollmentSchema = z.object({
  id: z.string().uuid(),
  classId: z.string().uuid(),
  userId: z.number().int(),
  role: ClassRole,
  joinedAt: z.date(),
});

export const ClassTestAssignmentSchema = z.object({
  id: z.string().uuid(),
  classId: z.string().uuid(),
  testId: z.string().uuid(),
  dueAt: z.date().nullable(),
  assignedById: z.number().int(),
  createdAt: z.date(),
});

// Request schemas
export const CreateClassSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  subjectId: z.string().uuid().optional(),
});

export const UpdateClassSchema = CreateClassSchema.partial();

export const AssignTestToClassSchema = z.object({
  classId: z.string().uuid(),
  testId: z.string().uuid(),
  dueAt: z.coerce.date().optional(),
});
