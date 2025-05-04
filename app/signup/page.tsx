import Link from "next/link";
import { SubmitButton } from "../authuser/signin/submit-button";
import { createClient } from "@/utils/supabase/server";
import { createClientAdmin } from "@/utils/supabase/client"; // Import admin client
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function CustomerSignup({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/authuser/admin/dashboard");
  }

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabaseAdmin = createClientAdmin();

    // Use admin API to create user with email_confirm: true
    const { error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        first_name: first_name,
        last_name: last_name,
        role: "customer",
        password: password,
      },
    });

    if (error) {
      return redirect("/signup?message=Could not authenticate user");
    }

    return redirect(
      "/signin?message=Account created successfully. Please sign in"
    );
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
          </svg>
          Back
        </Link>

        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign up to get started with SN-Mart
          </p>
        </div>

        <form
          className="mt-8 space-y-6 rounded-lg bg-white p-8 shadow-xl"
          action={signUp}
        >
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="first_name" className="sr-only">
                First name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="First name"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="sr-only">
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Last Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <SubmitButton
            formAction={signUp}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-main-theme py-2 px-4 text-sm font-medium text-white hover:bg-main-theme/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            pendingText="Signing Up..."
          >
            Sign Up
          </SubmitButton>

          <div className="text-sm text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </p>
          </div>

          {searchParams?.message && (
            <p className="mt-4 rounded-md bg-red-50 p-3 text-center text-sm text-red-600 border border-red-200">
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
