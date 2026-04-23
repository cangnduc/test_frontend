import type { UserRole } from "@/prisma/generated/prisma/enums";

/**
 * The minimal shape of user data needed for permission decisions.
 * Kept intentionally lean — only fields that appear in CASL conditions.
 *
 * `id` is typed as `number | string` because Better-Auth's session
 * returns string IDs, while the Prisma schema uses Int. CASL's
 * MongoDB-style conditions handle the coercion.
 */
export interface AppUser {
  id: number | string;
  role: UserRole;
  banned: boolean;
}
