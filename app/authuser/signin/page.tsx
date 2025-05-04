import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  signOutAdmin,
  signOutAdminNoRedirect,
  signOutCustomer,
} from "@/utils/functions/signOut";
import LoginForm from "@/components/authuser/LoginForm";

export default async function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && user?.user_metadata?.role?.includes("customer")) {
    return redirect("/home");
  } else if (user) {
    return redirect("/authuser/admin/dashboard");
  }

  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/authuser/signin?message=Could not authenticate user");
    }

    if (data.user?.user_metadata?.role?.includes("customer"))
      return await signOutCustomer();
    if (data.user?.user_metadata?.role?.includes("store-manager")) {
      if (role !== "store-manager") {
        await signOutAdminNoRedirect();
        return redirect(`/authuser/signin?message=You are not a ${role}`);
      }
      return redirect("/authuser/store/dashboard");
    }
    if (data.user?.user_metadata?.role?.includes("vendor-manager")) {
      if (role !== "vendor-manager") {
        await signOutAdminNoRedirect();
        return redirect(`/authuser/signin?message=You are not a ${role}`);
      }
      return redirect("/authuser/supplier/dashboard");
    }
    if (data.user?.user_metadata?.role?.includes("admin")) {
      if (role !== "admin") {
        await signOutAdminNoRedirect();
        return redirect(`/authuser/signin?message=You are not a ${role}`);
      }
      return redirect("/authuser/admin/dashboard");
    }
  };

  return (
    <div className="flex w-screen min-h-[100svh] flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Link
          href="/home"
          className="group absolute left-4 top-4 sm:left-8 sm:top-8 inline-flex items-center rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="-ml-1 mr-1 h-4 w-4 text-gray-500 transition-transform group-hover:-translate-x-1"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>{" "}
          Back
        </Link>

        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Admin Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access the admin panel.
          </p>
        </div>

        <LoginForm signIn={signIn} message={searchParams?.message} />
      </div>
    </div>
  );
}
