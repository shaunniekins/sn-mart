import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// fetch the specifc product based on filtered store_id, product_id and return if the status is pending or not
export const fetchStockRequestData = async (
  store_id: number,
  product_id: number
) => {
  try {
    const { data, error } = await supabase
      .from("Stock_Requests")
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

export const insertStockRequestData = async (newStockRequest: {
  store_id: number;
  product_id: number;
  requested_quantity: number;
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
