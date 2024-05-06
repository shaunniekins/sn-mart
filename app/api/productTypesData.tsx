import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchProductTypesData = async () => {
  try {
    const { data, error } = await supabase
      .from("Product_Types")
      .select()
      .order("product_type_name");

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data returned");
    }

    return data;
  } catch (error) {
    console.error("Error fetching type:", error);
    return null;
  }
};

// admin
export const fetchAllProductTypesData = async (
  searchValue: string,
  entriesPerPage: number,
  currentPage: number
) => {
  const offset = (currentPage - 1) * entriesPerPage;

  let query = supabase
    .from("Product_Types")
    .select(`*`, { count: "exact" })
    .order("product_type_name");

  if (searchValue) {
    const searchFields = ["product_type_name"];
    const searchQuery = searchFields
      .map((field) => `${field}.ilike.%${searchValue}%`)
      .join(",");
    query = query.or(searchQuery);
  }

  try {
    const response = await query.range(offset, offset + entriesPerPage - 1);

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error fetching type:", error);
    throw error;
  }
};

export const deleteProductTypeData = async (productTypeId: number) => {
  try {
    const response = await supabase
      .from("Product_Types")
      .delete()
      .match({ product_type_id: productTypeId });

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
    console.error("Error deleting type:", error);
    throw error;
  }
};

export const insertProductTypeData = async (productTypeName: string) => {
  try {
    const response = await supabase
      .from("Product_Types")
      .insert([{ product_type_name: productTypeName }]);

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
    console.error("Error inserting type:", error);
    throw error;
  }
};

export const editProductTypeData = async (
  productTypeId: number,
  productTypeName: string
) => {
  try {
    const response = await supabase
      .from("Product_Types")
      .update({ product_type_name: productTypeName })
      .match({ product_type_id: productTypeId });

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
    console.error("Error editing type:", error);
    throw error;
  }
};
