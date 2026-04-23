import { z } from "zod";
import { PassageType, DifficultyLevel, Visibility } from "./common";

export const PassageSchema = z.object({
  id: z.string().uuid(),
  type: PassageType,
  title: z.string(),
  content: z.string(),
  difficulty: DifficultyLevel,
  visibility: Visibility,
  tags: z.array(z.string()),
  explanation: z.string().nullable(),
  isDeleted: z.boolean(),
  subjectId: z.string().uuid(),
  createdById: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const CreatePassageSchema = z.object({
  type: PassageType,
  title: z.string(),
  content: z.string(),
  difficulty: DifficultyLevel.optional(),
  visibility: Visibility.optional(),
  tags: z.array(z.string()).optional(),
  explanation: z.string().optional(),
  subjectId: z.string().uuid(),
});

export const UpdatePassageSchema = CreatePassageSchema.partial();
