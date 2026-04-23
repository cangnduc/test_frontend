import z from "zod";
import { SubjectType } from "./common";

export const SubjectSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: SubjectType.nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateSubjectSchema = z.object({
  code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: SubjectType.nullable(),
});

export const UpdateSubjectSchema = CreateSubjectSchema.partial();
