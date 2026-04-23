import { AbilityBuilder } from "@casl/ability";
import { UserRole } from "@/prisma/generated/prisma/enums";
import {
  createMongoAbility,
  type AppAbility,
  type DefinePermissions,
} from "../ability";
import type { AppUser } from "../types";

import { defineGuestPermissions } from "./guest";
import { defineStudentPermissions } from "./student";
import { defineTeacherPermissions } from "./teacher";
import { defineModeratorPermissions } from "./moderator";
import { defineAdminPermissions } from "./admin";
import { defineParentPermissions } from "./parent";

/**
 * Maps each UserRole to its permission definer function.
 *
 * Following the CASL cookbook "roles with static permissions" pattern:
 * https://casl.js.org/v6/en/cookbook/roles-with-static-permissions
 *
 * To add a new role, create a new definer file and add it here.
 */
const rolePermissions: Record<UserRole, DefinePermissions> = {
  [UserRole.USER]: defineStudentPermissions,
  [UserRole.TEACHER]: defineTeacherPermissions,
  [UserRole.MOD]: defineModeratorPermissions,
  [UserRole.ADMIN]: defineAdminPermissions,
  [UserRole.PARENT]: defineParentPermissions,
};

/**
 * Build a CASL Ability for the given user (or guest if undefined).
 *
 * This is the single entry point for the permission system.
 * Called once per request by the CASL Fastify plugin.
 *
 * @param user - The authenticated user, or undefined for guests.
 * @returns A fully configured AppAbility instance.
 */
export function defineAbilityFor(user?: AppUser): AppAbility {
  const builder = new AbilityBuilder<AppAbility>(createMongoAbility);

  // 1. Always apply guest (public read) permissions
  defineGuestPermissions(builder);

  // 2. If authenticated and not banned, apply role-specific permissions
  if (user && !user.banned) {
    const defineForRole = rolePermissions[user.role];
    if (defineForRole) {
      defineForRole(user, builder);
    }
  }

  return builder.build();
}
