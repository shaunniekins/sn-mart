import { convertUrlFriendlyCategory } from "@/utils/component_functions/conversion";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchViewProductsDetailsData = async (categoryName: string) => {
  const convertedCategoryName = convertUrlFriendlyCategory(categoryName);
  try {
    const { data, error } = await supabase
      .from("ViewProductDetails")
      .select()
      .eq("product_type_name", convertedCategoryName);

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
    console.error("Error fetching product:", error);
    return null;
  }
};

// admin
export const fetchAllProductsData = async (
  searchValue: string,
  entriesPerPage: number,
  currentPage: number
) => {
  const offset = (currentPage - 1) * entriesPerPage;

  let query = supabase
    .from("ViewProductDetails")
    .select(`*`, { count: "exact" })
    .order("product_name");

  if (searchValue) {
    const searchFields = [
      "product_name",
      "upc_code",
      "brand_name",
      "product_type_name",
    ];
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
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const deleteProductData = async (productId: number) => {
  try {
    const response = await supabase
      .from("Products")
      .delete()
      .match({ product_id: productId });

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const insertProductData = async (newProduct: {
  product_name: string;
  upc_code: string;
  size: string;
  price: number;
  brand_id: number | null;
  product_type_id: number | null;
  image_url?: string | null;
}) => {
  try {
    const response = await supabase.from("Products").insert([newProduct]);

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const editProductData = async (
  productId: number,
  updatedProduct: {
    product_name?: string;
    upc_code?: string;
    size?: string;
    price?: number;
    brand_id?: number | null;
    product_type_id?: number | null;
    image_url?: string | null;
  }
) => {
  try {
    const response = await supabase
      .from("Products")
      .update(updatedProduct)
      .match({ product_id: productId });

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};
