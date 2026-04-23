"use client";

import { authClient } from "@/auth/auth-client";
import { useActionState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AuthCard, AuthInput, AuthButton } from "@/components/auth/auth-card";

const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ActionState = {
  error: string | null;
  success: boolean;
  fieldErrors?: Record<string, string[] | undefined>;
};

export function ClientSignUpPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (prevState: ActionState, formData: FormData) => {
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      const validation = signUpSchema.safeParse({
        name,
        email,
        password,
        confirmPassword,
      });

      if (!validation.success) {
        return {
          error: "Please fix the errors below.",
          success: false,
          fieldErrors: validation.error.flatten().fieldErrors,
        };
      }

      try {
        const result = await authClient.signUp.email({
          email,
          password,
          name,
        });

        if (result.error) {
          return { error: result.error.message, success: false };
        }
        router.push("/login?message=Account created successfully");
        return { error: null, success: true };
      } catch (err: any) {
        return { error: err.message || "Something went wrong", success: false };
      }
    },
    { error: null, success: false },
  );

  return (
    <div className="flex w-full max-w-[1100px] flex-col items-center gap-12 lg:flex-row lg:gap-20">
      {/* Visual Side */}
      <div className="hidden flex-1 flex-col items-center text-center lg:flex lg:items-start lg:text-left">
        <div className="relative mb-8 flex h-14 items-center gap-3 rounded-[16px] bg-white/5 px-4 ring-1 ring-white/10 backdrop-blur-xl">
          <div className="h-4 w-4 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
          <span className="text-[13px] font-medium text-zinc-400">
            Join 10,000+ Students
          </span>
        </div>
        <h1 className="text-[48px] font-bold leading-[1.1] tracking-tight text-white sm:text-[64px]">
          Start Your <br />
          <span className="text-gradient">Fluency Journey.</span>
        </h1>
        <p className="mt-6 max-w-[460px] text-[19px] text-zinc-400 font-normal leading-relaxed">
          Create an account to track your progress, unlock advanced modules, and
          join a community of dedicated English learners.
        </p>

        <div className="relative mt-8 aspect-video w-full max-w-[500px]">
          <div className="absolute inset-0 bg-primary/20 blur-[100px]" />
          <Image
            src="/images/hero-v2.png"
            alt="Learning Universe"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain mask-radial opacity-80"
          />
        </div>
      </div>

      {/* Form Side */}
      <AuthCard className="p-6 sm:p-8">
        <div className="mb-8 text-center lg:text-left">
          <h2 className="text-[28px] font-bold text-white">Create Account</h2>
          <p className="mt-2 text-[15px] text-zinc-500">
            Free forever. No credit card required.
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-3">
          <div className="space-y-1">
            <AuthInput name="name" placeholder="Full Name" required />
            {state.fieldErrors?.name && (
              <p className="px-1 text-[12px] text-red-400">
                {state.fieldErrors.name[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <AuthInput
              type="email"
              name="email"
              placeholder="Email address"
              required
            />
            {state.fieldErrors?.email && (
              <p className="px-1 text-[12px] text-red-400">
                {state.fieldErrors.email[0]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <AuthInput
                type="password"
                name="password"
                placeholder="Password"
                required
              />
              {state.fieldErrors?.password && (
                <p className="px-1 text-[12px] text-red-400">
                  {state.fieldErrors.password[0]}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <AuthInput
                type="password"
                name="confirmPassword"
                placeholder="Confirm"
                required
              />
              {state.fieldErrors?.confirmPassword && (
                <p className="px-1 text-[12px] text-red-400">
                  {state.fieldErrors.confirmPassword[0]}
                </p>
              )}
            </div>
          </div>

          <p className="px-1 py-2 text-[11px] text-zinc-500 leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link href="#" className="text-white underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-white underline">
              Privacy Policy
            </Link>
            .
          </p>

          <AuthButton isPending={isPending} className="mt-2">
            Create Account
          </AuthButton>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-zinc-950 px-4 text-zinc-600 font-medium">
              Quick sign up
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() =>
              authClient.signIn.social({ provider: "google", callbackURL: "/" })
            }
            className="flex h-[52px] w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 transition-all hover:bg-white/10 active:scale-95"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[12px] font-bold text-black">
              G
            </div>
            <span className="text-[15px] font-medium text-white">
              Sign up with Google
            </span>
          </button>
        </div>

        <p className="mt-8 text-center text-[14px] text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-white hover:text-primary"
          >
            Sign In
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
