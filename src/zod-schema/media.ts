import { z } from "zod";
import { MediaType } from "./common";

/** Central repository for uploaded media files */
export const MediaSchema = z.object({
  id: z.string(),
  type: MediaType,
  url: z.string().url(),
  ownerId: z.number().int(),
  isDeleted: z.boolean(),
  alt: z.string().nullable(),
  size: z.number().int().nullable(),
  mimeType: z.string().nullable(),
  hash: z.string().nullable(),
  width: z.number().int().nullable(),
  height: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateMediaSchema = z.object({
  type: MediaType,
  url: z.string().url(),
  alt: z.string().optional(),
  size: z.number().int().optional(),
  mimeType: z.string().optional(),
  hash: z.string().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
});
