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
    console.error("Error fetching brand:", error);
    return null;
  }
};

// admin
export const fetchAllBrandsData = async (
  searchValue: string,
  entriesPerPage: number,
  currentPage: number
) => {
  const offset = (currentPage - 1) * entriesPerPage;

  let query = supabase
    .from("Brands")
    .select(`*`, { count: "exact" })
    .order("brand_name");

  if (searchValue) {
    const searchFields = ["brand_name"];
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
    console.error("Error fetching brand:", error);
    throw error;
  }
};

export const deleteBrandData = async (brandId: number) => {
  try {
    const response = await supabase
      .from("Brands")
      .delete()
      .match({ brand_id: brandId });

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
    console.error("Error deleting brand:", error);
    throw error;
  }
};

export const insertBrandData = async (brandName: string) => {
  try {
    const response = await supabase
      .from("Brands")
      .insert([{ brand_name: brandName }]);

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
    console.error("Error inserting brand:", error);
    throw error;
  }
};

export const editBrandData = async (brandId: number, brandName: string) => {
  try {
    const response = await supabase
      .from("Brands")
      .update({ brand_name: brandName })
      .match({ brand_id: brandId });

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
    console.error("Error editing brand:", error);
    throw error;
  }
};
