"use client";

import { Suspense, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        enrollment_id: data.enrollment_id,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin" || result.error.includes("unauthorized") || result.error.toLowerCase().includes("credentials")) {
          setError("enrollment_id", { message: "Invalid service number or password." });
          setError("password", { message: "Invalid service number or password." });
        } else {
          toast.error("Login failed. Please try again.");
        }
        return;
      }

      queryClient.clear();
      try {
        localStorage.removeItem("aeromentor_current_user_rank");
      } catch {}
      window.location.assign("/dashboard");
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {session?.user && (
        <div className="mb-6 rounded-md border border-blue-200 bg-blue-50/70 px-4 py-3 text-body-sm text-gray-700">
          Currently signed in as{" "}
          <span className="font-semibold text-gray-900">
            {session.user.name || session.user.enrollment_id || "current user"}
          </span>
          . Sign in below to switch accounts, or{" "}
          <Link href="/dashboard" className="font-semibold text-blue-700 underline underline-offset-4">
            go to Dashboard
          </Link>
          .
        </div>
      )}

      {registered && (
        <div className="mb-6 rounded-md border border-success/30 bg-success/5 px-4 py-3">
          <p className="text-body-sm text-success font-medium">
            Account created successfully. Sign in with your credentials.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="enrollment_id">Service Number</Label>
          <Input
            id="enrollment_id"
            placeholder="e.g. 12345678"
            className="mt-2"
            {...register("enrollment_id")}
          />
          {errors.enrollment_id && (
            <p className="mt-1.5 text-body-sm text-error">
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
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1.5 text-body-sm text-error">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full font-medium" variant="blue" size="md" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
          {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
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
