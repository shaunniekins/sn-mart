import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchAllVendorsData = async () => {
  try {
    const { data, error } = await supabase
      .from("ViewVendorDetails")
      .select()
      .order("vendor_name");

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data returned");
    }

    return data;
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return null;
  }
};

export const fetchSpecificVendorDetailsData = async (
  vendor_manager_id: string
) => {
  try {
    const { data, error } = await supabase
      .from("ViewVendorDetails")
      .select()
      .eq("vendor_manager_id", vendor_manager_id);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data returned");
    }

    return data;
  } catch (error) {
    console.error("Error fetching vendor:", error);
    throw error;
  }
};

export const insertVendorData = async (newVendor: {
  vendor_name: string;
  vendor_location: string;
  vendor_manager_id: string;
}) => {
  try {
    const response = await supabase.from("Vendors").insert([newVendor]);

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
    console.error("Error inserting type:", error);
    throw error;
  }
};

export const editVendorData = async (
  vendorId: number,
  vendorManageId: string,
  updatedVendor: {
    vendor_name?: string;
    vendor_location?: string;
  }
) => {
  try {
    const response = await supabase
      .from("Vendors")
      .update(updatedVendor)
      .match({
        vendor_id: vendorId,
        vendor_manager_id: vendorManageId,
      });

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
    console.error("Error updating vendor:", error);
    throw error;
  }
};
