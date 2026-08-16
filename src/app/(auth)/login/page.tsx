"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        enrollment_id: data.enrollment_id,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid service number or password. Please try again.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-display-sm text-ink">
          Welcome Back, Cadet.
        </h2>
        <p className="text-body-md text-surface-tint mt-2">
          Sign in to continue your mission.
        </p>
      </div>

      {registered && (
        <div className="mb-6 rounded-xl border border-success/30 bg-success/10 px-4 py-3">
          <p className="text-body-sm text-success font-semibold">
            Account created successfully. Sign in with your credentials.
          </p>
        </div>
      )}

      {error && (
        <div role="alert" className="mb-6 rounded-xl border border-error/30 bg-error/10 px-4 py-3">
          <p className="text-body-sm text-error font-semibold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="enrollment_id">Service Number</Label>
          <Input
            id="enrollment_id"
            placeholder="SVC-2024-001"
            className="mt-2"
            autoComplete="username"
            aria-invalid={!!errors.enrollment_id}
            aria-describedby={errors.enrollment_id ? "enrollment_id-error" : undefined}
            {...register("enrollment_id")}
          />
          {errors.enrollment_id && (
            <p id="enrollment_id-error" className="text-body-sm text-error font-semibold mt-1.5">
              {errors.enrollment_id.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="mt-2"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
          {errors.password && (
            <p id="password-error" className="text-body-sm text-error font-semibold mt-1.5">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>

      <p className="text-center text-body-md text-surface-tint mt-8">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-ink font-semibold underline underline-offset-4 hover:text-surface-tint transition-colors"
        >
          Create one
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
