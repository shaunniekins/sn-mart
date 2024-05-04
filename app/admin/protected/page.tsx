import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboardComponent from "@/components/admin/AdminDashboardComponent";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/admin/signin");
  }

  if (user && user?.user_metadata?.role?.includes("customer")) {
    return redirect("/");
  }

  return <AdminDashboardComponent />;
}
