"use client";
import { authClient } from "@/auth/auth-client";
export async function ListUser() {
  const { data: users, error } = await authClient.admin.listUsers({
    query: {
      limit: 10,
    },
  });
  console.log("Users:", users);
  console.log("Error:", error);
  return (
    <div>
      <h1>User List</h1>
    </div>
  );
}
