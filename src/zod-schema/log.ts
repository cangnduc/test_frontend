import { z } from "zod";

// ─── Model Schemas (match Prisma models) ─────────────────────

/** Internal system log for debugging */
export const SystemLogSchema = z.object({
  id: z.string().uuid(),
  level: z.string(),
  message: z.string(),
  stack: z.string().nullable(),
  context: z.any().nullable(),
  traceId: z.string().nullable(),
  userId: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/** Security and compliance audit trail */
export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  actorId: z.number().int().nullable(),
  action: z.string(),
  resource: z.string(),
  resourceId: z.string(),
  before: z.any().nullable(),
  after: z.any().nullable(),
  ip: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
