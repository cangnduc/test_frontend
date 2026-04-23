import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from "../ability";

/**
 * Guest (unauthenticated) permissions.
 * Applied to ALL users as a base layer — even authenticated ones
 * get these so public content is always readable.
 *
 * Note: This definer takes only the builder (no user), since guests
 * have no identity.
 */
export function defineGuestPermissions(
  builder: AbilityBuilder<AppAbility>,
): void {
  const { can } = builder;

  // Public content is readable by everyone
  can("read", "Question", { visibility: "PUBLIC" } as any);
  can("read", "Passage", { visibility: "PUBLIC" } as any);
  can("read", "Test", { status: "PUBLISHED" } as any);
  can("read", "Subject");
}
