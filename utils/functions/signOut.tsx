"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signOutAdmin() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/authuser/signin");
}

export async function signOutAdminNoRedirect() {
  const supabase = createClient();
  return await supabase.auth.signOut();
}

export async function signOutCustomer() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/home");
}
