import { z } from "zod";

/** Academic subject category (e.g., Grammar, Vocabulary, IELTS) */
export const SubjectSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.string().nullable(),
  icon: z.string().nullable(),
  color: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateSubjectSchema = z.object({
  code: z.string().trim().min(1),
  name: z.string().trim().min(1),
  description: z.string().nullable(),
  type: z.string().nullable(),
  icon: z.string().nullable(),
  color: z.string().nullable(),
});

export const UpdateSubjectSchema = CreateSubjectSchema.partial();
