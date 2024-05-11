import { redirect } from "next/navigation";

import AdminDashboardComponent from "@/components/admin/AdminDashboardComponent";
import ManageProductCatalog from "@/components/admin/LinkComponents/ManageProductCatalog";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import ManageBrands from "@/components/admin/LinkComponents/ManageBrands";
import ManageProductCategories from "@/components/admin/LinkComponents/ManageProductCategories";
import ManageUsers from "@/components/admin/LinkComponents/ManageUsers";
import { Suspense } from "react";
import Loading from "@/app/loading";

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
    return redirect("/authuser/signin");
  }

  if (user && user?.user_metadata?.role?.includes("customer")) {
    return redirect("/home");
  }

  let activeComponent = <AdminDashboardComponent />;

  switch (params.slug) {
    case "product":
      activeComponent = <ManageProductCatalog />;
      break;
    case "brand":
      activeComponent = <ManageBrands />;
      break;
    case "category":
      activeComponent = <ManageProductCategories />;
      break;
    case "users":
      activeComponent = <ManageUsers />;
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
