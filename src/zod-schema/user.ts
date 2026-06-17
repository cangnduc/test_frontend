import { z } from "zod";
import {
  UserRole, Gender, NotificationType,
  TokenTransactionReason, AttemptStatus
} from "./common";

// ─── Model Schemas (match Prisma models) ─────────────────────

/** Core User model */
export const UserSchema = z.object({
  id: z.number().int(),
  name: z.string().nullable(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().url().nullable(),
  banned: z.boolean(),
  role: UserRole,
  phone: z.string().nullable(),
  lastLoginAt: z.date().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** Authentication account linked to a User (e.g., Google, Email/Password) */
export const AccountSchema = z.object({
  id: z.number().int(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.number().int(),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  idToken: z.string().nullable(),
  accessTokenExpiresAt: z.date().nullable(),
  refreshTokenExpiresAt: z.date().nullable(),
  scope: z.string().nullable(),
  password: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** Active user session for authentication tracking */
export const SessionSchema = z.object({
  id: z.string().uuid(),
  expiresAt: z.date(),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  userId: z.number().int(),
});

/** Email or phone verification tokens */
export const VerificationSchema = z.object({
  id: z.string().uuid(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** Extended user profile */
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

/** Gamification and activity statistics */
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

/** In-app notification */
export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.number().int(),
  type: NotificationType,
  title: z.string(),
  body: z.string(),
  isRead: z.boolean(),
  actionUrl: z.string().nullable(),
  metadata: z.any().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  expiresAt: z.date().nullable(),
});

/** Token balance change record */
export const TokenTransactionSchema = z.object({
  id: z.string().uuid(),
  userId: z.number().int(),
  amount: z.number().int(),
  balanceAfter: z.number().int(),
  reason: TokenTransactionReason,
  testId: z.string().nullable(),
  attemptId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** Historical student performance on a test */
export const UserTestProgressSchema = z.object({
  id: z.string().uuid(),
  userId: z.number().int(),
  testId: z.string().uuid(),
  status: AttemptStatus,
  score: z.number().nullable(),
  maxScore: z.number().nullable(),
  percentage: z.number().nullable(),
  lastAttemptId: z.string().uuid().nullable(),
  lastActivityAt: z.date(),
  updatedAt: z.date(),
});

/** Parent-student link */
export const ParentStudentLinkSchema = z.object({
  id: z.string().uuid(),
  parentId: z.number().int(),
  studentId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ─── Request Schemas ─────────────────────────────────────────

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
