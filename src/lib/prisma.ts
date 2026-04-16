// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ["query", "error", "warn"],
//   });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
import { env } from "@/config/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/prisma/generated/prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const connectionString = env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
