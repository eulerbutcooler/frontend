import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { api } from "@/lib/api-client";
import { AdminUsersView } from "@/components/admin/admin-users-view";
import { isAdminUser, type AdminUsersDirectory, type User } from "@/types/user";

export const dynamic = "force-dynamic";

export default async function UsersDirectoryPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  let me: User | null = null;
  try {
    me = await api.get<User>("/api/v1/users/me");
  } catch (err) {
    console.error("Failed to verify current user for admin directory:", err);
  }

  if (!isAdminUser(me ?? session.user)) {
    redirect("/dashboard");
  }

  let directory: AdminUsersDirectory = { instructors: [], students: [] };
  try {
    const fetched = await api.get<AdminUsersDirectory>("/api/v1/admin/users");
    if (fetched) {
      directory = {
        instructors: Array.isArray(fetched.instructors) ? fetched.instructors : [],
        students: Array.isArray(fetched.students) ? fetched.students : [],
      };
    }
  } catch (err) {
    console.error("Failed to fetch admin users directory:", err);
  }

  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
      <div className="mb-6 px-2 shrink-0">
        <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">
          Users Directory
        </h1>
        <p className="text-[13px] text-gray-500 mt-0.5">
          View all registered instructors, their associated subjects, and enrolled trainees.
        </p>
      </div>

      <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl overflow-y-auto p-6 md:p-8 scrollbar-hide">
        <AdminUsersView directory={directory} />
      </div>
    </div>
  );
}
