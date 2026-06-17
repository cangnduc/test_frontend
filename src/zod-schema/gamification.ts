import { z } from "zod";
import { LeaderboardScope } from "./common";

// ─── Model Schemas (match Prisma models) ─────────────────────

/** A badge or milestone that can be earned */
export const AchievementSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  category: z.string().nullable(),
  condition: z.any(),
  xpReward: z.number().int(),
  tokenReward: z.number().int(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** A user earning an achievement */
export const AchievementUnlockSchema = z.object({
  id: z.string().uuid(),
  userId: z.number().int(),
  achievementId: z.string().uuid(),
  unlockedAt: z.date(),
  updatedAt: z.date(),
});

/** Cached ranking entry */
export const LeaderboardSchema = z.object({
  id: z.string().uuid(),
  userId: z.number().int(),
  scope: LeaderboardScope,
  scopeId: z.string().nullable(),
  rank: z.number().int(),
  score: z.number(),
  period: z.string(),
  updatedAt: z.date(),
});

// ─── Request Schemas ─────────────────────────────────────────

export const CreateAchievementSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  category: z.string().optional(),
  condition: z.any(),
  xpReward: z.number().int().optional(),
  tokenReward: z.number().int().optional(),
});
