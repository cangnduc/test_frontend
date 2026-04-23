// frontend/src/lib/casl/get-ability.ts
import "server-only";
import { cache } from "react";
import { getSession } from "@/actions/getSession";
import { defineAbilityFor } from "@/auth/casl/roles";
import type { AppAbility } from "@/auth/casl/ability";
import type { AppUser } from "@/auth/casl/types";

/**
 * Build the CASL ability for the current request.
 *
 * Uses React.cache() to deduplicate within a single server render —
 * multiple components calling getAbility() in the same request
 * will share the same session fetch and ability build.
 *
 * ⚠️ This calls getSession() which uses headers() — a runtime API.
 * Components using this must be in a dynamic (non-cached) context.
 * Do NOT use inside "use cache" boundaries.
 */
export const getAbility = cache(async (): Promise<AppAbility> => {
  const session = await getSession();

  if (!session?.user) {
    // Guest ability (public reads only)
    return defineAbilityFor(undefined);
  }

  const user: AppUser = {
    id: session.user.id,
    role: (session.user.role as AppUser["role"]) ?? "USER",
    banned: session.user.banned ?? false,
  };

  return defineAbilityFor(user);
});
