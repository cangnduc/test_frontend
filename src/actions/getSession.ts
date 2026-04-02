"use server";
import { cookies } from "next/headers";
export async function getSession() {
  const cookieStore = await cookies();
  const response = await fetch("http://localhost:3000/api/auth/get-session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  if (!response.ok) return null;
  return response.json();
}
