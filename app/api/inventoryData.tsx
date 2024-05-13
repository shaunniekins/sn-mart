import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// stores inventory
export const fetchStoreInventoryData = async (
  store_id: number,
  searchValue: string,
  entriesPerPage: number,
  currentPage: number
) => {
  const offset = (currentPage - 1) * entriesPerPage;

  let query = supabase
    .from("ViewInventoryDetails")
    .select()
    .eq("store_id", store_id);

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

// Filtering array of product IDs (for checked products)
export const fetchCheckedProductInStoreInventoryData = async (
  store_id: number,
  searchValue: string,
  entriesPerPage: number,
  currentPage: number
) => {
  const offset = (currentPage - 1) * entriesPerPage;

  let query = supabase
    .from("ViewInventoryDetails")
    .select()
    .eq("store_id", store_id);

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
    // Return an array of product IDs
    return response.data.map((item: any) => item.product_id);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// create table
//   public."Inventory" (
//     inventory_id serial,
//     store_id integer null,
//     product_id integer null,
//     quantity integer null default 0,
//     constraint Inventory_pkey primary key (inventory_id),
//     constraint Inventory_store_id_product_id_key unique (store_id, product_id),
//     constraint Inventory_product_id_fkey foreign key (product_id) references "Products" (product_id),
//     constraint Inventory_store_id_fkey foreign key (store_id) references "Stores" (store_id)
//   ) tablespace pg_default;

export const deleteStoreInventoryData = async (
  store_id: number,
  product_id: number
) => {
  try {
    const response = await supabase
      .from("Inventory")
      .delete()
      .eq("store_id", store_id)
      .eq("product_id", product_id);

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error deleting inventory:", error);
    throw error;
  }
};

export const insertStoreInventoryData = async (newInventory: {
  store_id: number;
  product_id: number;
  quantity: number;
}) => {
  try {
    const response = await supabase.from("Inventory").insert([newInventory]);

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error inserting inventory:", error);
    throw error;
  }
};

export const editStoreInventoryData = async (
  store_id: number,
  product_id: number,
  updatedInventory: {
    quantity?: number;
  }
) => {
  try {
    const response = await supabase
      .from("Inventory")
      .update(updatedInventory)
      .eq("store_id", store_id)
      .eq("product_id", product_id);

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error editing inventory:", error);
    throw error;
  }
};
