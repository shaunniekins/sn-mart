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
    if (data.user?.user_metadata?.role?.includes("vendor")) {
      if (role !== "vendor") {
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
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/home"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm">
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
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1">
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <LoginForm signIn={signIn} message={searchParams?.message} />
    </div>
  );
}
