import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { ac, roles } from "@/lib/auth/auth-permissions";
import { prisma } from "@/lib/prisma";
import { env } from "@/config/env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  logger: {
    disabled: false,
    disableColors: false,
    level: "error",
    log: (level, message, ...args) => {
      // Custom logging implementation
      console.log(`[${level}] ${message}`, ...args);
    },
  },
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins: [
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    env.BETTER_AUTH_URL,
  ],

  advanced: {
    database: {
      generateId: "serial",
      defaultFindManyLimit: 100,
    },
  },
  socialProviders: {
    google: {
      enabled: true,
      prompt: "select_account",
      clientId: env.GOOGLE_CLIENT_ID! as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET! as string,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  session: {
    //freshAge: 0,
    cookieCache: {
      enabled: true,
      maxAge: 300, // 5 minutes
      // refreshCache: {
      //   updateAge: 60, // Refresh when 60 seconds remain before expiry
      // },
    },
  },
  databaseHooks: {
    account: {
      update: {
        before: async (account, ctx) => {
          console.log("--->>account", account);
          console.log("--->>ctx", ctx);
          return {
            data: { account },
          };
        },
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email" && ctx.method === "POST") {
        const body = ctx.body;
        if (!body || !body.email) return;

        const email = body.email as string;
        const valid_domains = ["@gmail.com", "@yahoo.com", "@outlook.com"];
        if (process.env.NODE_ENV === "development") {
          valid_domains.push("@example.com");
        }
        if (!valid_domains.some((d) => email.endsWith(d))) {
          throw new APIError("BAD_REQUEST", {
            message: `Email domain must be one of: ${valid_domains.join(", ")}`,
          });
        }

        const name = normalizeName((body.name as string) || "");
        return {
          context: {
            ...ctx,
            body: {
              ...body,
              name,
            },
          },
        };
      }
    }),
  },
  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN", "TEACHER", "MOD", "PARENT"],
        required: false,
        defaultValue: "USER",
        input: true, // don't allow user to set role
      },
      banned: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false, // don't allow user to set banned
      },
    },
  },
  plugins: [
    admin({
      defaultRole: "USER",
      adminRoles: ["ADMIN"],
      ac,
      roles,
    }),
    nextCookies(),
  ],
});
function normalizeName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
