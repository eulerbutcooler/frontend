import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { api } from "@/lib/api-client";
import { ProfileView } from "@/components/profile/profile-view";
import type { User } from "@/types/user";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  let me: User | null = null;
  try {
    me = await api.get<User>("/api/v1/users/me");
  } catch (err) {
    console.error("Failed to load current user profile:", err);
  }

  const profile: User = me ?? {
    id: session.user.id,
    name: session.user.name || "User",
    enrollment_id: session.user.enrollment_id || session.user.serviceNumber || "",
    rank: session.user.rank || "",
    role: session.user.role === "instructor" ? "instructor" : "student",
    is_master: Boolean(session.user.isMaster),
    created_at: "",
    updated_at: "",
  };

  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
      <div className="mb-6 px-2 shrink-0">
        <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">
          Profile
        </h1>
        <p className="text-[13px] text-gray-500 mt-0.5">
          View your account details and update your naval rank.
        </p>
      </div>

      <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl overflow-y-auto p-6 md:p-8 scrollbar-hide">
        <ProfileView user={profile} />
      </div>
    </div>
  );
}
