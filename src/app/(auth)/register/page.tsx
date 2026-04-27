"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { RANKS } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ApiEnvelope } from "@/types/api";
import type { User } from "@/types/user";

const ERROR_MAP: Record<string, string> = {
  conflict: "This service number is already registered.",
  bad_request: "Please check your input and try again.",
};

function formatRank(rank?: string | null): string {
  if (!rank) return "—";
  return rank.charAt(0).toUpperCase() + rank.slice(1);
}

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "student",
    },
  });

  async function onSubmit(data: RegisterInput) {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const envelope: ApiEnvelope<User> = await res.json();

      if (!res.ok || envelope.error) {
        const code = envelope.error?.code ?? "unknown";
        setError(ERROR_MAP[code] ?? envelope.error?.message ?? "Registration failed.");
        return;
      }

      router.push("/login?registered=1");
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
          Join the Academy.
        </h2>
        <p className="text-body-md text-surface-tint mt-2">
          Create your cadet credentials.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-error/30 bg-error/5 px-4 py-3">
          <p className="text-body-sm text-error font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="John Maverick"
            className="mt-2"
            autoComplete="name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-body-sm text-error mt-1.5">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="enrollment_id">Service Number</Label>
          <Input
            id="enrollment_id"
            placeholder="SVC-2024-001"
            className="mt-2"
            autoComplete="username"
            {...register("enrollment_id")}
          />
          {errors.enrollment_id && (
            <p className="text-body-sm text-error mt-1.5">
              {errors.enrollment_id.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="rank">Rank</Label>
          <Select onValueChange={(val) => setValue("rank", val as RegisterInput["rank"])}>
            <SelectTrigger className="mt-2" id="rank">
              <SelectValue placeholder="Select your rank" />
            </SelectTrigger>
            <SelectContent>
              {RANKS.map((rank) => (
                <SelectItem key={rank} value={rank}>
                  {formatRank(rank)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.rank && (
            <p className="text-body-sm text-error mt-1.5">
              {errors.rank.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <Select
            defaultValue="student"
            onValueChange={(val) => setValue("role", val as RegisterInput["role"])}
          >
            <SelectTrigger className="mt-2" id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="instructor">Instructor</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-body-sm text-error mt-1.5">
              {errors.role.message}
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
            autoComplete="new-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-body-sm text-error mt-1.5">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating Account…" : "Create Account"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>

      <p className="text-center text-body-md text-surface-tint mt-8">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-ink font-semibold underline underline-offset-4 hover:text-surface-tint transition-colors"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
