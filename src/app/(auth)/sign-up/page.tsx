"use client";
import { authClient } from "../../lib/auth-client";
import { useActionState } from "react";

type ActionState = { error: string | null; success: boolean };
interface ErrorResponse {
  message: string;
  status: number;
  statusText?: string;
  code?: string;
}
interface SuccessResponse {
	user: {
		id: string;
		email: string;
		name: string;
		emailVerified: boolean;
		image ? : string;
		createdAt: Date;
		updatedAt: Date;
	};
	session: {
		id: string;
		token: string;
		userId: string;
		expiresAt: Date;
	};
}
export default function Home() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (prevState: ActionState, formData: FormData) => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const name = formData.get("name") as string;
      try {
        const result = await authClient.signUp.email({
          email,
          password,
          name: name,
        });
       
        if (result.error) {
          return { error: result.error.message, success: false };
        }
        return { error: null, success: true };
      } catch (err: any) {
        return { error: err.message || "Something went wrong", success: false };
      }
    },
    { error: null, success: false },
  );

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-full">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <form className="flex flex-col gap-4" action={formAction}>
          <input
            type="name"
            name="name"
            placeholder="Name"
            required
            className="bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="test@gmail.com"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="password123"
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        {state.error && <div className="mt-4 text-red-500">{state.error}</div>}
        {state.success && (
          <div className="mt-4 text-green-500">Successfully signed up!</div>
        )}
      </div>
    </div>
  );
}
