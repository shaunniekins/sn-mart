import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchAllStockRequestsData = async (
  vendor_id: number,
  searchValue: string,
  entriesPerPage: number,
  currentPage: number,
  otherFilter: string
) => {
  const offset = (currentPage - 1) * entriesPerPage;

  let query = supabase
    .from("ViewStockRequests")
    .select(`*`, { count: "exact" })
    .eq("vendor_id", vendor_id);

  if (searchValue) {
    const searchFields = ["store_name", "product_name"];
    const searchQuery = searchFields
      .map((field) => `${field}.ilike.%${searchValue}%`)
      .join(",");
    query = query.or(searchQuery);
  }

  if (otherFilter) {
    query = query.eq("status", otherFilter);
  }

  try {
    const response = await query
      .range(offset, offset + entriesPerPage - 1)
      .order("status")
      .order("request_date")
      .order("product_name");

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error fetching stock requests:", error);
    throw error;
  }
};

// fetch the specifc product based on filtered store_id, product_id and return if the status is pending or not
export const fetchStockRequestData = async (
  store_id: number,
  product_id: number
) => {
  try {
    const { data, error } = await supabase
      .from("ViewStockRequests")
      .select()
      .eq("store_id", store_id)
      .eq("product_id", product_id)
      .eq("status", "Pending");

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching stock request:", error);
    return null;
  }
};

export const fetchStockRequestDataForQty = async (
  store_id: number,
  product_id: number
) => {
  try {
    const { data, error } = await supabase
      .from("ViewStockRequests")
      .select()
      .eq("store_id", store_id)
      .eq("product_id", product_id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching stock request:", error);
    return null;
  }
};

export const insertStockRequestData = async (newStockRequest: {
  store_id: number;
  product_id: number;
  requested_quantity: number;
  vendor_id: number;
}) => {
  try {
    const response = await supabase
      .from("Stock_Requests")
      .insert([newStockRequest]);

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error inserting stock request:", error);
    throw error;
  }
};

//edit the pending stock request
export const editStockRequestData = async (
  request_id: number,
  updatedStockRequest: {
    requested_quantity?: number;
    status?: string;
  }
) => {
  try {
    const response = await supabase
      .from("Stock_Requests")
      .update(updatedStockRequest)
      .match({ request_id });

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error editing stock request:", error);
    throw error;
  }
};

export const editStockRequestDataByProductId = async (
  product_id: number,
  vendor_id: number,
  updatedStockRequest: {
    requested_quantity?: number;
    status?: string;
    vendor_id?: number;
    request_date?: string;
  }
) => {
  try {
    const response = await supabase
      .from("Stock_Requests")
      .update(updatedStockRequest)
      .match({ product_id, vendor_id });

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error editing stock request:", error);
    throw error;
  }
};

export const editStockDispatchedDataByProductId = async (
  product_id: number,
  updatedStockRequest: {
    status: string;
  }
) => {
  try {
    const response = await supabase
      .from("Stock_Requests")
      .update(updatedStockRequest)
      .match({ product_id });

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error editing stock request:", error);
    throw error;
  }
};

export const deleteStockRequestData = async (request_id: number) => {
  try {
    const response = await supabase
      .from("Stock_Requests")
      .delete()
      .match({ request_id });

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error deleting stock request:", error);
    throw error;
  }
};
