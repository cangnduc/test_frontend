import { z } from "zod";
import { MediaType } from "./common";

export const MediaSchema = z.object({
  id: z.string(),
  type: MediaType,
  url: z.string().url(),
  ownerId: z.number().int(),
  isDeleted: z.boolean(),
  alt: z.string().nullable(),
  size: z.number().int().nullable(),
  mimeType: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateMediaSchema = z.object({
  type: MediaType,
  url: z.string().url(),
  alt: z.string().optional(),
  size: z.number().int().optional(),
  mimeType: z.string().optional(),
});
