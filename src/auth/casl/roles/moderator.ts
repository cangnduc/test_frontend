import type { DefinePermissions } from "../ability";

/**
 * Moderator (MOD role) permissions.
 * Maps to the "Moderator" column in schema-and-rbac.md §4.
 *
 * Moderators are content police — they can:
 * - Read/update/soft-delete ALL Questions, Passages, Tests
 * - Ban users (but NOT change roles or hard-delete users)
 * - Override test attempt scores
 * - Read audit logs (read-only)
 * - Manage all Classes and enrollments
 * - Cannot start test attempts themselves
 */
export const defineModeratorPermissions: DefinePermissions = (
  user,
  { can, cannot },
) => {
  // ── User & Profile ──────────────────────────────────
  can("read", "User");
  can("update", "User", { id: user.id } as any); // own
  can("ban", "User");
  cannot("changeRole", "User");
  cannot("delete", "User");

  can("create", "Profile", { userId: user.id } as any);
  can("read", "Profile");
  can("update", "Profile"); // can edit any profile (mod action)
  cannot("delete", "Profile");

  // ── Subject (curriculum) ────────────────────────────
  can("read", "Subject");
  can("create", "Subject");
  can("update", "Subject");
  cannot("delete", "Subject"); // only Admin

  // ── Questions & Passages ────────────────────────────
  can("create", "Question");
  can("read", "Question");
  can("update", "Question");
  can("delete", "Question"); // soft-delete
  can("restore", "Question");

  can("create", "Passage");
  can("read", "Passage");
  can("update", "Passage");
  can("delete", "Passage"); // soft-delete

  // ── Tests ───────────────────────────────────────────
  can("read", "Test");
  can("update", "Test");
  can("publish", "Test");
  can("archive", "Test");
  cannot("delete", "Test"); // only Admin can hard-delete
  cannot("create", "Test"); // mods supervise, don't author

  // ── Test Settings & Sections ────────────────────────
  can("read", "TestSetting");
  can("update", "TestSetting");
  can("read", "TestSection");
  can("update", "TestSection");

  // ── Classes ─────────────────────────────────────────
  can("read", "Class");
  can("update", "Class");
  cannot("delete", "Class"); // only Admin
  can("create", "ClassEnrollment");
  can("read", "ClassEnrollment");
  can("delete", "ClassEnrollment");
  can("assign", "ClassTestAssignment");
  can("read", "ClassTestAssignment");

  // ── Test Attempts & Grading ─────────────────────────
  can("read", "TestAttempt");
  can("grade", "ManualGrade");
  can("create", "ManualGrade");
  can("read", "ManualGrade");
  can("update", "ManualGrade");
  can("override", "TestAttempt");
  cannot("create", "TestAttempt"); // mods don't take tests
  cannot("delete", "TestAttempt"); // only Admin

  // ── Media ───────────────────────────────────────────
  can("upload", "Media");
  can("read", "Media");
  can("delete", "Media");

  // ── Stats & Tokens ─────────────────────────────────
  can("read", "UserStats");
  can("read", "TokenTransaction");
  cannot("adjustTokens", "TokenTransaction");

  // ── Notifications ──────────────────────────────────
  can("read", "Notification", { userId: user.id } as any);
  can("update", "Notification", { userId: user.id } as any);

  // ── Logs ───────────────────────────────────────────
  can("read", "AuditLog");
  cannot("delete", "AuditLog");
  cannot("read", "SystemLog"); // Admin only
};
