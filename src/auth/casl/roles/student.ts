import type { DefinePermissions } from "../ability";

/**
 * Student (USER role) permissions.
 * Maps to the "Student" column in schema-and-rbac.md §4.
 *
 * Students can:
 * - Read public content (inherited from guest layer)
 * - CRUD their own Profile
 * - Read/start/submit their own TestAttempts
 * - Upload limited media (image/audio)
 * - Read their own stats and token ledger
 * - Manage their own notifications
 */
export const defineStudentPermissions: DefinePermissions = (
  user,
  { can },
) => {
  // ── User & Profile ──────────────────────────────────
  can("read", "User", { id: user.id } as any);
  can("update", "User", { id: user.id } as any);
  can("delete", "User", { id: user.id } as any);

  can("create", "Profile", { userId: user.id } as any);
  can("read", "Profile", { userId: user.id } as any);
  can("update", "Profile", { userId: user.id } as any);
  can("delete", "Profile", { userId: user.id } as any);

  // ── Test Attempts ───────────────────────────────────
  can("create", "TestAttempt"); // start attempt
  can("read", "TestAttempt", { userId: user.id } as any);
  can("update", "TestAttempt", { userId: user.id } as any); // submit

  // ── Media ───────────────────────────────────────────
  can("upload", "Media");
  can("read", "Media", { ownerId: user.id } as any);
  can("delete", "Media", { ownerId: user.id } as any);

  // ── Stats & Tokens ─────────────────────────────────
  can("read", "UserStats", { userId: user.id } as any);
  can("read", "TokenTransaction", { userId: user.id } as any);

  // ── Notifications ──────────────────────────────────
  can("read", "Notification", { userId: user.id } as any);
  can("update", "Notification", { userId: user.id } as any); // mark as read
  can("delete", "Notification", { userId: user.id } as any);
};
