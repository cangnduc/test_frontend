"use client";

import { authClient } from "@/auth/auth-client";
import { useActionState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AuthCard, AuthInput, AuthButton } from "@/components/auth/auth-card";

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
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (prevState: ActionState, formData: FormData) => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const validation = signInSchema.safeParse({ email, password });

      if (!validation.success) {
        return {
          error: "Please fix the errors below.",
          success: false,
          fieldErrors: validation.error.flatten().fieldErrors,
        };
      }

      try {
        const result = await authClient.signIn.email(
          { email, password },
          {
            onSuccess: () => router.push("/dashboard"),
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

  const handleSocialLogin = async (provider: "google" | "github") => {
    await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });
  };

  return (
    <div className="flex w-full max-w-[1000px] flex-col items-center gap-12 lg:flex-row lg:gap-20">
      {/* Visual Side */}
      <div className="hidden flex-1 flex-col items-center text-center lg:flex lg:items-start lg:text-left">
        <div className="relative mb-8 h-20 w-20 rounded-[24px] bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-xl">
          <div className="h-full w-full rounded-[12px] bg-primary animate-pulse" />
        </div>
        <h1 className="text-[48px] font-bold leading-[1.1] tracking-tight text-white sm:text-[64px]">
          Elevate Your <br />
          <span className="text-gradient">English Mastery.</span>
        </h1>
        <p className="mt-6 max-w-[440px] text-[19px] text-zinc-400 font-normal leading-relaxed">
          Sign in to access your personalized learning path, adaptive tests, and
          real-time proficiency insights.
        </p>

        <div className="relative mt-12 aspect-square w-full max-w-[400px]">
          <div className="absolute inset-0 bg-primary/20 blur-[100px]" />
          <Image
            src="/images/auth-v2.png"
            alt="Secure Authentication"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain mask-radial"
            loading="eager"
          />
        </div>
      </div>

      {/* Form Side */}
      <AuthCard>
        <div className="mb-10 text-center lg:text-left">
          <h2 className="text-[28px] font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-[15px] text-zinc-500">
            Sign in to your Antigravity account
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="space-y-1">
            <AuthInput
              type="email"
              name="email"
              placeholder="Email address"
              required
              defaultValue="test@gmail.com"
            />
            {state.fieldErrors?.email && (
              <p className="px-1 text-[12px] text-red-400">
                {state.fieldErrors.email[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <AuthInput
              type="password"
              name="password"
              placeholder="Password"
              required
              defaultValue="password123"
            />
            {state.fieldErrors?.password && (
              <p className="px-1 text-[12px] text-red-400">
                {state.fieldErrors.password[0]}
              </p>
            )}
          </div>

          <Link
            href="#"
            className="mt-1 self-end text-[13px] text-primary hover:opacity-80"
          >
            Forgot password?
          </Link>

          <AuthButton isPending={isPending} className="mt-4">
            Sign In
          </AuthButton>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-[12px] uppercase">
            <span className="bg-zinc-950 px-4 text-zinc-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSocialLogin("google")}
            className="flex h-[52px] items-center justify-center rounded-2xl border border-white/5 bg-white/5 transition-all hover:bg-white/10 active:scale-95"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black text-[14px] font-bold">
              G
            </div>
          </button>
        </div>

        <p className="mt-10 text-center text-[14px] text-zinc-500">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-white hover:text-primary"
          >
            Sign up for free
          </Link>
        </p>

        {state.error && (
          <div className="mt-6 rounded-2xl bg-red-500/10 p-4 text-center text-[14px] text-red-400 ring-1 ring-inset ring-red-500/20">
            {state.error}
          </div>
        )}
      </AuthCard>
    </div>
  );
}
