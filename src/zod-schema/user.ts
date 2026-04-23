import { z } from "zod";
import { UserRole, Gender } from "./common";

export const UserSchema = z.object({
  id: z.number().int(),
  name: z.string().nullable(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().url().nullable(),
  banned: z.boolean(),
  role: UserRole,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  bio: z.string().nullable(),
  displayName: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  dateOfBirth: z.date().nullable(),
  gender: Gender.nullable(),
  language: z.string().nullable(),
  timezone: z.string().nullable(),
  userId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserStatsSchema = z.object({
  id: z.string().uuid(),
  userId: z.number().int(),
  tokens: z.number().int(),
  xp: z.number().int(),
  level: z.number().int(),
  streak: z.number().int(),
  testsTaken: z.number().int(),
  testsCompleted: z.number().int(),
  testsPassed: z.number().int(),
  lastActiveAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Request schemas
export const CreateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  role: UserRole.optional(),
});

export const UpdateProfileSchema = z.object({
  bio: z.string().optional(),
  displayName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: Gender.optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
});
