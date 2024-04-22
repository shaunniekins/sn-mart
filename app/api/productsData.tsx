import { convertUrlFriendlyCategory } from "@/utils/utils/conversion";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchViewProductsDetailsData = async (categoryName: string) => {
  const convertedCategoryName = convertUrlFriendlyCategory(categoryName);
  try {
    const { data, error } = await supabase
      .from("ViewProductDetails")
      .select()
      .eq("product_type", convertedCategoryName);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const fetchSpecificProductDetailsData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("ViewProductDetails")
      .select()
      .eq("product_id", id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
