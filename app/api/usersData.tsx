import { createClient, createClientAdmin } from "@/utils/supabase/client";

const supabase = createClient();
const supabaseAdmin = createClientAdmin();

// available user roles
export const rolesData = async () => {
  try {
    const { data, error } = await supabase.from("ViewRoles").select("role");

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data returned");
    }

    return data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return null;
  }
};

// user data (except admin)
export const fetchAllUsersData = async (
  searchValue: string,
  entriesPerPage: number,
  currentPage: number,
  roles: string[]
) => {
  const offset = (currentPage - 1) * entriesPerPage;

  let query = supabase.from("ViewUsers").select().not("role", "is", null);

  if (searchValue) {
    const searchFields = ["last_name", "first_name", "email"];
    const searchQuery = searchFields
      .map((field) => `${field}.ilike.%${searchValue}%`)
      .join(",");
    query = query.or(searchQuery);
  }

  if (roles.length > 0 && !roles.includes("")) {
    query = query.in("role", roles);
  }

  query = query.order("role").order("created_at", { ascending: false });

  try {
    const response = await query.range(offset, offset + entriesPerPage - 1);

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await supabase.auth.admin.deleteUser(userId);

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const insertNewUser = async (newUser: {
  email: string;
  role: string;
  last_name: string | null;
  first_name: string | null;
}) => {
  try {
    const response = await supabase.auth.signUp({
      // const response = await supabaseAdmin.auth.admin.createUser({
      email: newUser.email,
      password: "password",
      //   user_metadata: {
      //     role: newUser.role,
      //     last_name: newUser.last_name,
      //     first_name: newUser.first_name,
      //   },
      //   email_confirm: true,
      //    the problem is it will logout current user (admin)
      options: {
        data: {
          role: newUser.role,
          last_name: newUser.last_name,
          first_name: newUser.first_name,
        },
      },
    });

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const editUser = async (
  userId: string,
  updatedUser: {
    email?: string;
    role?: string;
    last_name?: string | null;
    first_name?: string | null;
  }
) => {
  try {
    const response = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email: updatedUser.email,
      user_metadata: {
        role: updatedUser.role,
        last_name: updatedUser.last_name,
        first_name: updatedUser.first_name,
      },
    });

    if (response.error) {
      throw response.error;
    }

    return response;
  } catch (error) {
    console.error("Error editing user:", error);
    throw error;
  }
};
