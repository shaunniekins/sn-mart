import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchDashboardData = async () => {
  try {
    const query = supabase.from("Brands").select();

    const response = await query;

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
