"use client";
import { authClient } from "@/lib/auth/auth-client";
import { useActionState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { SocialLogin } from "./social-login";
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type ActionState = {
  error: string | null;
  success: boolean;
  fieldErrors?: Record<string, string[] | undefined>;
};

export default function ClientLoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<
    ActionState,
    globalThis.FormData
  >(
    async (prevState: ActionState, formData: globalThis.FormData) => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const validation = signInSchema.safeParse({
        email,
        password,
      });

      if (!validation.success) {
        return {
          error: "Please fix the errors below.",
          success: false,
          fieldErrors: validation.error.flatten().fieldErrors,
        };
      }

      try {
        const result = await authClient.signIn.email(
          {
            email,
            password,
          },
          {
            onRequest: () => {
              console.log("Sign-in request started");
            },
            onSuccess: () => {
              router.push("/test");
            },
            onError: (error) => {
              console.log("Sign-in error:", error);
            },
          },
        );

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
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <form className="flex flex-col gap-4" action={formAction}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="test@gmail.com"
          />
          {state.fieldErrors?.email && (
            <div className="text-red-500">
              {state.fieldErrors.email.map((msg) => (
                <p key={msg}>{msg}</p>
              ))}
            </div>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="password123"
          />
          {state.fieldErrors?.password && (
            <div className="text-red-500">
              {state.fieldErrors.password.map((msg) => (
                <p key={msg}>{msg}</p>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <SocialLogin />
        {state.error && <div className="mt-4 text-red-500">{state.error}</div>}
        {state.success && (
          <div className="mt-4 text-green-500">Successfully signed in!</div>
        )}
      </div>
    </div>
  );
}
