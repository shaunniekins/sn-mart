import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// admin
export const fetchAllStoresData = async (
  searchValue: string,
  entriesPerPage: number,
  currentPage: number
) => {
  const offset = (currentPage - 1) * entriesPerPage;

  let query = supabase
    .from("ViewStoreDetails")
    .select(`*`, { count: "exact" })
    .order("store_name");

  if (searchValue) {
    const searchFields = [
      "store_name",
      "store_location",
      "manager_first_name",
      "manager_last_name",
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
    console.error("Error fetching stores:", error);
    throw error;
  }
};

export const fetchSpecificStoreDetailsData = async (
  store_manager_id: string
) => {
  try {
    const { data, error } = await supabase
      .from("ViewStoreDetails")
      .select()
      .eq("manager_id", store_manager_id);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data returned");
    }

    return data;
  } catch (error) {
    console.error("Error fetching store:", error);
    return null;
  }
};

export const insertStoreData = async (newStore: {
  store_name: string;
  store_location: string;
  store_operating_hours: string;
  store_manager_id: string;
}) => {
  try {
    const response = await supabase.from("Stores").insert([newStore]);

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
    console.error("Error inserting type:", error);
    throw error;
  }
};

export const editStoreData = async (
  storeId: number,
  storeManageId: string,
  updatedStore: {
    store_name?: string;
    store_location?: string;
    store_operating_hours?: string;
  }
) => {
  try {
    const response = await supabase.from("Stores").update(updatedStore).match({
      store_id: storeId,
      store_manager_id: storeManageId,
    });

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
    console.error("Error editing store:", error);
    throw error;
  }
};
