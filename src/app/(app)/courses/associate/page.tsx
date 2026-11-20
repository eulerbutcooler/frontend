import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { AssociateCoursesView } from "@/components/course/associate-courses-view";

export default async function AssociateCoursesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "instructor") {
    redirect("/courses");
  }

  return <AssociateCoursesView />;
}
