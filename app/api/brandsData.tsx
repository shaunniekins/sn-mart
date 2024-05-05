import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchBrandsData = async () => {
  try {
    const { data, error } = await supabase
      .from("Brands")
      .select()
      .order("brand_name");

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data returned");
    }

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
