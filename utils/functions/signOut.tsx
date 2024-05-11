"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signOutAdmin() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/authuser/signin");
}

export async function signOutCustomer() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/home");
}
