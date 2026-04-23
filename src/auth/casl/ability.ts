import {
  createMongoAbility,
  type MongoAbility,
  type AbilityBuilder,
} from "@casl/ability";
import type { AppUser } from "./types";

// ── Actions ──────────────────────────────────────────────
// Standard CRUD + domain-specific actions from schema-and-rbac.md §5
export type Actions =
  | "manage" // CASL wildcard — admin only
  | "create"
  | "read"
  | "update"
  | "delete"
  // Domain-specific
  | "publish" // test:publish  (DRAFT → PUBLISHED)
  | "archive" // test:archive  (→ ARCHIVED)
  | "assign" // test:assign   (assign test to class)
  | "grade" // attempt:grade (manual-grade open-ended)
  | "override" // attempt:override (change score post-grading)
  | "restore" // question:restore (un-soft-delete)
  | "ban" // user:ban
  | "changeRole" // user:changeRole
  | "adjustTokens" // token:adjust
  | "upload"; // media:upload

// ── Subjects ─────────────────────────────────────────────
// Every Prisma model that needs permission checks.
// Using string literals (not Prisma model types) keeps the permission
// layer decoupled from the ORM — @casl/prisma can be layered on later.
export type Subjects =
  | "User"
  | "Profile"
  | "Subject" // curriculum subject (the Prisma model, not CASL subject)
  | "Question"
  | "Passage"
  | "Test"
  | "TestSetting"
  | "TestSection"
  | "Class"
  | "ClassEnrollment"
  | "ClassTestAssignment"
  | "TestAttempt"
  | "AttemptAnswer"
  | "ManualGrade"
  | "Media"
  | "UserStats"
  | "TokenTransaction"
  | "Notification"
  | "SystemLog"
  | "AuditLog"
  | "all"; // CASL wildcard

// ── AppAbility ───────────────────────────────────────────
export type AppAbility = MongoAbility<[Actions, Subjects]>;

// ── DefinePermissions ────────────────────────────────────
// Signature for per-role permission definer functions.
export type DefinePermissions = (
  user: AppUser,
  builder: AbilityBuilder<AppAbility>,
) => void;

// Re-export for convenience
export { createMongoAbility };
