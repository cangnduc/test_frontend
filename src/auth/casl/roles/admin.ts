import type { DefinePermissions } from "../ability";

/**
 * Admin (ADMIN role) permissions.
 * Maps to the "Admin" column in schema-and-rbac.md §4.
 *
 * Admins have unrestricted access via CASL's `manage` + `all` wildcards.
 */
export const defineAdminPermissions: DefinePermissions = (
  _user,
  { can },
) => {
  can("manage", "all");
};
