import { convertUrlFriendlyCategory } from "@/src/utils/conversion";
import { supabase } from "@/src/utils/supabase";

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
