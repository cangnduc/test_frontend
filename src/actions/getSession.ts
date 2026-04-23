import "server-only";
import { headers } from "next/headers";
import { auth } from "@/auth/auth";
import { cache } from "react";
import { cacheLife } from "next/cache";

/**
 * Get the current user's session in a Server Component or Server Action.
 * Returns null if not authenticated.
 *
 * This calls headers() which is a runtime API.
 * Components using this MUST be wrapped in <Suspense>
 * or be in a dynamic (non-cached) context.
 */
export const getSession = cache(async () => {
  "use cache: private";
  cacheLife("minutes");

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  //wait 2seconds

  return session;
});
