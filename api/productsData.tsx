import { convertUrlFriendlyCategory } from "@/utils/conversion";
import { supabase } from "@/utils/supabase";

// export const fetchViewProductsData = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("view_product_details")
//         .select();

//       if (error) {
//         throw error;
//       }

//       return data;
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       return null;
//     }
//   };

export const fetchViewProductsDetailsData = async (categoryName: string) => {
  const convertedCategoryName = convertUrlFriendlyCategory(categoryName);
  try {
    const { data, error } = await supabase
      .from("view_product_details")
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
