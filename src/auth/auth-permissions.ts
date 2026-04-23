import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statements = {
  ...defaultStatements,
  posts: ["create", "read", "update", "delete", "update:own", "delete:own"],
  questions: [
    "create",
    "list",
    "read",
    "read:own",
    "update",
    "delete",
    "update:own",
    "delete:own",
    "list:own",
  ],
  passages: [
    "create",
    "list",
    "read",
    "read:own",
    "update",
    "delete",
    "update:own",
    "delete:own",
    "list:own",
  ],
  tests: [
    "create",
    "list",
    "read",
    "read:own",
    "update",
    "delete",
    "update:own",
    "delete:own",
    "list:own",
  ],
} as const;

export const ac = createAccessControl(statements);

export const roles = {
  user: ac.newRole({
    questions: ["read"],
  }),

  admin: ac.newRole({
    questions: ["create", "list", "read", "update", "delete"],
    passages: ["create", "list", "read", "update", "delete"],
    tests: ["create", "list", "read", "update", "delete"],
    ...adminAc.statements,
  }),
  mod: ac.newRole({
    questions: ["read", "update", "delete", "list"],
    passages: ["read", "update", "delete", "list"],
    tests: ["read", "update", "delete", "list"],
    ...adminAc.statements,
  }),
  teacher: ac.newRole({
    questions: ["create", "read:own", "update:own", "delete:own", "list:own"],
    passages: ["create", "read:own", "update:own", "delete:own", "list:own"],
    tests: ["create", "read:own", "update:own", "delete:own", "list:own"],
  }),
  parent: ac.newRole({
    questions: ["read"],
    passages: ["read"],
    tests: ["read"],
  }),
};
