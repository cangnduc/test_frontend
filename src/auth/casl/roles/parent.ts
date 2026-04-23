import type { DefinePermissions } from "../ability";

/**
 * Parent (PARENT role) permissions.
 * Maps to the "Parent" column in schema-and-rbac.md §4.
 *
 * Parents have very limited access:
 * - Read own User/Profile
 * - Read linked children's profiles, stats, and attempts
 *   (child-scoping will be enforced at the service layer via
 *    ParentStudentLink queries, not in CASL conditions)
 * - Read public content (inherited from guest layer)
 *
 * NOTE: Full parent-child scoping deferred until ParentStudentLink
 * API is built. For now, parents get self-management + public reads.
 */
export const defineParentPermissions: DefinePermissions = (
  user,
  { can },
) => {
  // ── User & Profile (self-management) ────────────────
  can("read", "User", { id: user.id } as any);
  can("update", "User", { id: user.id } as any);
  can("delete", "User", { id: user.id } as any);

  can("create", "Profile", { userId: user.id } as any);
  can("read", "Profile", { userId: user.id } as any);
  can("update", "Profile", { userId: user.id } as any);
  can("delete", "Profile", { userId: user.id } as any);

  // ── Child monitoring (broad read, service-level filtering) ──
  // Parents can read stats/attempts, but the service layer must
  // filter to only linked children via ParentStudentLink.
  can("read", "UserStats");
  can("read", "TestAttempt");

  // ── Notifications ──────────────────────────────────
  can("read", "Notification", { userId: user.id } as any);
  can("update", "Notification", { userId: user.id } as any);
};
