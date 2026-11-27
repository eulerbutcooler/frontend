"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Award, CheckSquare, Loader2, ShieldCheck } from "lucide-react";

import { clientApi } from "@/lib/api-client.client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalize } from "@/lib/utils";
import {
  INDIAN_NAVY_RANKS,
  INDIAN_NAVY_SAILOR_RANKS,
  SIGNUP_RANKS,
  isAdminUser,
  type User,
} from "@/types/user";

interface ProfileViewProps {
  user: User;
}

interface UpdateRankResponse {
  user: User;
  access_token: string;
}

function formatRankDisplay(rank?: string | null): string {
  const trimmed = rank?.trim();
  if (!trimmed) return "Not set";
  if (SIGNUP_RANKS.some((item) => item === trimmed)) {
    return trimmed;
  }
  return capitalize(trimmed.replace(/_/g, " "));
}

function formatMemberSince(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export function ProfileView({ user }: ProfileViewProps) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const queryClient = useQueryClient();

  const [currentRank, setCurrentRank] = useState(user.rank);
  const initialSelectedRank = SIGNUP_RANKS.some((r) => r === user.rank)
    ? user.rank
    : "";
  const [selectedRank, setSelectedRank] = useState<string>(initialSelectedRank);
  const [saving, setSaving] = useState(false);

  const isInstructor = user.role === "instructor";
  const isAdmin = isAdminUser(user);
  const normalizedCurrent = currentRank.trim().toLowerCase();
  const isLegacyRank =
    normalizedCurrent === "officer" || normalizedCurrent === "agniveer";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRank || selectedRank === currentRank || saving) return;

    setSaving(true);
    try {
      const res = await clientApi.put<UpdateRankResponse>("/api/v1/users/me/rank", {
        rank: selectedRank,
      });

      const updatedRank = res.user?.rank || selectedRank;
      const enrollmentKey = (
        res.user?.enrollment_id ||
        user.enrollment_id ||
        ""
      )
        .trim()
        .toLowerCase();

      setCurrentRank(updatedRank);

      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("aeromentor_current_user_rank");
          if (enrollmentKey) {
            localStorage.setItem(
              `aeromentor_user_rank_${enrollmentKey}`,
              updatedRank
            );
          }
        } catch {}
      }

      await updateSession({
        rank: updatedRank,
        accessToken: res.access_token,
      });

      await queryClient.invalidateQueries({ queryKey: ["users-me"] });
      router.refresh();
      toast.success(`Rank updated to ${updatedRank}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update rank."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Profile Summary Banner */}
      <div className="bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-[20px] font-bold shrink-0">
            {user.name?.charAt(0)?.toUpperCase() ?? "U"}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[18px] font-bold text-gray-900 truncate">
                {user.name}
              </h2>
              <span
                className={
                  isInstructor
                    ? "px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                    : "px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                }
              >
                {isInstructor ? "Instructor" : "Trainee"}
              </span>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <ShieldCheck className="w-3 h-3" />
                  Admin
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[12px] text-gray-500">
              <span className="font-mono font-medium text-gray-700">
                Service No: {user.enrollment_id?.toUpperCase() || "—"}
              </span>
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-800 font-medium">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                {formatRankDisplay(currentRank)}
              </span>
              {user.created_at && (
                <>
                  <span className="text-gray-300">•</span>
                  <span>Member since {formatMemberSince(user.created_at)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {isInstructor && (
          <Link
            href="/courses/associate"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-[13px] font-medium transition-colors shrink-0 self-start sm:self-center shadow-2xs"
          >
            <CheckSquare className="w-4 h-4 text-gray-500" />
            Associate Subjects
          </Link>
        )}
      </div>

      {/* Update Naval Rank Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5"
      >
        <div>
          <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">
            Update Naval Rank
          </h3>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Change the rank displayed across your profile, dashboard greeting, and standings.
          </p>
        </div>

        {isLegacyRank && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-[12px] text-amber-800">
            Your account currently uses the legacy rank category{" "}
            <span className="font-semibold">{formatRankDisplay(currentRank)}</span>.
            Select your specific Indian Navy rank below to update it.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-8">
            <label
              htmlFor="naval-rank-select"
              className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-2"
            >
              Naval Rank
            </label>
            <Select
              value={selectedRank || undefined}
              onValueChange={setSelectedRank}
            >
              <SelectTrigger id="naval-rank-select">
                <SelectValue placeholder="Select your naval rank" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Officer Ranks</SelectLabel>
                  {INDIAN_NAVY_RANKS.map((rank) => (
                    <SelectItem key={rank} value={rank}>
                      {rank}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Sailor Ranks</SelectLabel>
                  {INDIAN_NAVY_SAILOR_RANKS.map((rank) => (
                    <SelectItem key={rank} value={rank}>
                      {rank}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-4">
            <Button
              type="submit"
              variant="blue"
              size="md"
              className="w-full h-11 font-medium"
              disabled={!selectedRank || selectedRank === currentRank || saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Update Rank"
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Account Details Card */}
      <div className="bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 space-y-4">
        <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">
          Account Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Full Name
            </span>
            <p className="text-[14px] font-semibold text-gray-900 mt-1">
              {user.name}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Service Number
            </span>
            <p className="text-[14px] font-mono font-semibold text-gray-900 mt-1">
              {user.enrollment_id?.toUpperCase() || "—"}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Role
            </span>
            <p className="text-[14px] font-semibold text-gray-900 mt-1">
              {isInstructor ? (isAdmin ? "Instructor (Admin)" : "Instructor") : "Trainee"}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Current Rank
            </span>
            <p className="text-[14px] font-semibold text-gray-900 mt-1">
              {formatRankDisplay(currentRank)}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Joined Date
            </span>
            <p className="text-[14px] font-semibold text-gray-900 mt-1">
              {formatMemberSince(user.created_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
