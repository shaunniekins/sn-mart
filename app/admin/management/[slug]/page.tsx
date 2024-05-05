import { redirect } from "next/navigation";

import AdminDashboardComponent from "@/components/admin/AdminDashboardComponent";
import ManageProductCatalog from "@/components/admin/LinkComponents/ManageProductCatalog";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { headers } from "next/headers";

export default async function ManagementPage({
  params,
}: {
  params: { slug: string };
}) {
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

  let activeComponent = <AdminDashboardComponent />;

  switch (params.slug) {
    case "product":
      activeComponent = <ManageProductCatalog />;
      break;
    default:
      activeComponent = (
        <div className="h-full flex items-center justify-center text-gray-500">
          Page is not available
        </div>
      );
  }

  return activeComponent;
}
