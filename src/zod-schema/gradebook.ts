import { z } from "zod";
import { AttendanceStatus } from "./common";

// ─── Model Schemas (match Prisma models) ─────────────────────

/** An academic time period */
export const TermSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** Student presence record */
export const AttendanceSchema = z.object({
  id: z.string().uuid(),
  classId: z.string().uuid(),
  studentId: z.number().int(),
  date: z.date(),
  status: AttendanceStatus,
  note: z.string().nullable(),
  recordedById: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** Aggregated performance metrics */
export const GradeBookSchema = z.object({
  id: z.string().uuid(),
  studentId: z.number().int(),
  classId: z.string().uuid(),
  termId: z.string().uuid().nullable(),
  totalScore: z.number().nullable(),
  maxScore: z.number().nullable(),
  percentage: z.number().nullable(),
  grade: z.string().nullable(),
  updatedAt: z.date(),
});

// ─── Request Schemas ─────────────────────────────────────────

export const CreateTermSchema = z.object({
  name: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const RecordAttendanceSchema = z.object({
  classId: z.string().uuid(),
  studentId: z.number().int(),
  date: z.coerce.date(),
  status: AttendanceStatus,
  note: z.string().optional(),
});
