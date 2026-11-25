"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { SIGNUP_RANKS } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { capitalize } from "@/lib/utils";
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

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "student",
      rank: "Sub Lieutenant",
    },
  });

  async function onSubmit(data: RegisterInput) {
    setLoading(true);

    const payload = {
      ...data,
      name: data.name.trim(),
      enrollment_id: data.enrollment_id.trim(),
    };

    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
      
      const res = await fetch(
        `${apiUrl}/api/v1/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const envelope: ApiEnvelope<User> = await res.json();

      if (!res.ok || envelope.error) {
        const code = envelope.error?.code ?? "unknown";
        if (code === "conflict") {
          setError("enrollment_id", { message: "This service number is already registered." });
        } else {
          toast.error(envelope.error?.message ?? "Registration failed. Please check your inputs.");
        }
        return;
      }

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`aeromentor_user_rank_${payload.enrollment_id.toLowerCase()}`, payload.rank);
        } catch {}
      }

      router.push("/login?registered=1");
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
          . You can still create a new account below, or{" "}
          <Link href="/dashboard" className="font-semibold text-blue-700 underline underline-offset-4">
            go to Dashboard
          </Link>
          .
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Aman Yadav"
            className="mt-2"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" className="text-body-sm text-error font-semibold mt-1.5">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="enrollment_id">Service Number</Label>
          <Input
            id="enrollment_id"
            placeholder="1609"
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
          <Label htmlFor="rank">Naval Rank</Label>
          <Select 
            defaultValue="Sub Lieutenant"
            onValueChange={(val) => setValue("rank", val as RegisterInput["rank"])}
          >
            <SelectTrigger className="mt-2" id="rank">
              <SelectValue placeholder="Select your naval rank" />
            </SelectTrigger>
            <SelectContent>
              {SIGNUP_RANKS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.rank && (
            <p id="rank-error" className="text-body-sm text-error font-semibold mt-1.5">
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
              <SelectItem value="student">Trainee</SelectItem>
              <SelectItem value="instructor">Instructor</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p id="role-error" className="text-body-sm text-error font-semibold mt-1.5">
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

        <Button type="submit" className="w-full font-medium" variant="blue" size="md" disabled={loading}>
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
