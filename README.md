# SN Mart

This document provides instructions on how to set up and run the SN Mart application.

## 1. Environment Variables Setup

Create a `.env.local` file in the root directory of the project and add the following environment variables. Replace the placeholder values with your actual Supabase credentials.

```bash
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

* `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project anonymous key.
* `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`: Your Supabase project service role key (used for admin operations).

## 2. Database Setup

Connect to your Supabase database using a SQL client (like the Supabase SQL Editor) and run the following scripts in the specified order:

1. **Table Creation:** Execute the script to create the necessary database tables.
    * File: `public/sql/table_creations.sql`
2. **View Creation:** Execute the scripts to create database views for easier data querying.
    * File: `public/sql/views/ViewProductDetails.sql`
    * File: `public/sql/views/ViewInventoryDetails.sql`
    * File: `public/sql/views/ViewStoreDetails.sql`
    * File: `public/sql/views/ViewVendorDetails.sql`
    * *(Add other view scripts if any)*
3. **Profile Creation Trigger:** Execute the script to set up the trigger that automatically creates a profile entry when a new user signs up via Supabase Auth.
    * File: `public/sql/ProfileCreation.sql`
4. **Stock Requests Table:** Execute the script to create the table for managing stock requests.
    * File: `public/sql/Stock_Requests.sql`

## 3. Initial Data Setup

Populate the database with initial data by running the following SQL scripts:

1. **Brands:** Insert initial brand data.
    * File: `public/sql/initial_data_input/insert_data_brands.sql`
2. **Product Types:** Insert initial product category data.
    * File: `public/sql/initial_data_input/insert_data_product_types.sql`
3. **Vendors:** Insert initial vendor data.
    * File: `public/sql/initial_data_input/insert_data_vendors.sql`
4. **Products:** Insert initial product data. This script depends on Brands and Product Types being inserted first.
    * File: `public/sql/initial_data_input/insert_data_products.sql`

## 4. Admin User Setup

The primary administrator user needs to be created manually for security reasons.

1. **Create Admin User in Supabase:**
    * Go to your Supabase project dashboard -> Authentication -> Users.
    * Click "Add user".
    * Enter the admin email (e.g., `admin@gmail.com`) and a secure password.
    * **Important:** Ensure "Auto Confirm user" is **enabled** in your Supabase Authentication settings, or manually confirm the user.
2. **Update Admin Metadata:** Run the following SQL script to assign the 'admin' role and basic profile information to the newly created admin user. Replace `'admin@gmail.com'` if you used a different email.
    * File: `public/sql/AdminUpdateSetup.sql`

## 5. Running the Application

1. **Install Dependencies:**

    ```bash
    npm install
    ```

2. **Run Development Server:**

    ```bash
    npm run dev
    ```

    The application should now be running, typically at `http://localhost:3000`.

## 6. Application Usage & Management

* **Admin Role (`admin@gmail.com` or your chosen admin email):**
  * Access the admin dashboard via `/authuser/admin/dashboard` (after signing in through `/authuser/signin`).
  * **Manage Users:** Create, edit, and delete users (Store Managers, Vendor Managers). View customer accounts. Filter users by role. (`components/admin/components/ManageUsers.tsx`)
  * **Manage Brands:** Add, edit, and delete product brands. (`components/admin/components/ManageBrands.tsx`)
  * **Manage Product Categories:** Add, edit, and delete product types/categories. (`components/admin/components/ManageProductCategories.tsx`)
  * **Manage Product Catalog:** Add, edit, and delete products, assigning brands and categories. (`components/admin/components/ManageProductCatalog.tsx`)
  * **View Stores:** View a list of all stores, their locations, hours, and assigned managers. (`components/admin/components/ManageStores.tsx`)
* **Store Manager Role:**
  * Sign in via `/authuser/signin`.
  * Access the store dashboard via `/authuser/store/dashboard`.
  * **Manage Store Details:** Add or edit their assigned store's name, location, and operating hours. (`components/store/StoreDashboardComponent.tsx`)
  * **Manage Inventory:** Add/remove products available in their store, view current stock levels, and request restocking from vendors. (`components/store/components/StoreInventory.tsx`)
* **Vendor Manager Role:**
  * Sign in via `/authuser/signin`.
  * Access the vendor dashboard via `/authuser/supplier/dashboard`.
  * *(Functionality for managing vendor details and processing stock requests is implied by API routes like `app/api/vendorsData.tsx` and `app/api/stockRequestData.tsx`, but specific UI components are not fully shown in the provided context).*
* **Customer Role:**
  * Sign up via `/signup`.
  * Sign in via `/signin`.
  * Browse products, view categories, add items to the cart, and checkout. (`components/landing_page/*`, `/home`)
