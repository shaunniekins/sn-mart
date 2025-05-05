# SN Mart

This document provides instructions on how to set up and run the SN Mart application.

## 1. Environment Variables Setup

Create a `.env.local` file in the root directory of the project and add the following environment variables. Replace the placeholder values with your actual Supabase and S3 credentials.

```bash
# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

# Supabase S3-Compatible Storage Credentials
SUPABASE_S3_REGION=YOUR_S3_REGION
SUPABASE_S3_ENDPOINT=YOUR_S3_ENDPOINT
SUPABASE_S3_ACCESS_KEY=YOUR_S3_ACCESS_KEY
SUPABASE_S3_SECRET_KEY=YOUR_S3_SECRET_KEY
SUPABASE_S3_BUCKET=YOUR_S3_BUCKET_NAME
```

* `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project anonymous key.
* `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`: Your Supabase project service role key (used for admin operations).
* `SUPABASE_S3_REGION`: The AWS region for your Supabase S3-compatible storage (e.g., `ap-southeast-1`).
* `SUPABASE_S3_ENDPOINT`: The S3 endpoint URL provided by Supabase (e.g., `https://<project-ref>.supabase.co/storage/v1/s3`).
* `SUPABASE_S3_ACCESS_KEY`: Your S3 access key ID. **Note:** This is typically the Supabase project reference ID.
* `SUPABASE_S3_SECRET_KEY`: Your S3 secret access key. **Note:** This is typically the Supabase service role key.
* `SUPABASE_S3_BUCKET`: The name of the S3 bucket used for storing product images (e.g., `products`). Ensure this bucket exists in your Supabase storage.

## 2. Authentication System

SN Mart implements a role-based authentication system with the following user roles:

* **Admin**: Has access to all management interfaces and can create other users
* **Store Manager**: Can manage store inventory and handle store operations
* **Vendor Manager**: Can manage vendor information and handle restock requests
* **Customer**: Can browse products and make purchases

Each user type has specific permissions and is redirected to the appropriate interface after login.

## 3. Database Setup

Connect to your Supabase database using a SQL client (like the Supabase SQL Editor) and run the following scripts in the specified order:

1. **Create Database Tables**: Run `public/sql/2_table_creations.sql`
   * Creates tables for Brands, Stores, Customers, Vendors, Profiles, Product Types, Products, Product Vendors, Inventory, Sales, Sale Items, and Stock Requests
   * After executing this script, enable realtime functionality for the tables:
     1. Navigate to the Supabase Dashboard
     2. Go to "Table Editor"
     3. For each table that requires realtime updates (especially Inventory, Products, Sales, and Stock Requests), click on the table
     4. Go to upper tab
     5. Enable "Realtime" by toggling the switch to ON
     6. Save changes

2. **Create Database Views**: Run `public/sql/3_view_creations.sql`
   * Creates views for Inventory Details, Product Details, Stock Requests, Store Details, Users, Roles, and Vendor Details

## 4. Initial Data Setup

Populate the database with initial data by running the following SQL scripts:

1. **Product Types Data**: Run `public/sql/seed/1_insert_data_product_types.sql`
   * Inserts top-level product categories like Electronics, Clothing, Home & Kitchen, etc.

2. **Brands Data**: Run `public/sql/seed/2_insert_data_brands.sql`
   * Inserts brand information for different product categories (50 brands total)

3. **Products Data**: Run `public/sql/seed/3_insert_data_products.sql`
   * Inserts sample products across all categories with details like UPC code, price, and size

## 5. Admin User Setup

The primary administrator user needs to be created manually for security reasons.

1. **Create Admin User in Supabase:**
    * Go to your Supabase project dashboard -> Authentication -> Users.
    * Click "Add user".
    * Enter the admin email (e.g., `admin@gmail.com`) and a secure password.
    * **Important:** Ensure "Auto Confirm user" is **enabled** in your Supabase Authentication settings, or manually confirm the user.
2. **Update Admin Metadata:** Run the following SQL script to assign the 'admin' role and basic profile information to the newly created admin user. Replace `'admin@gmail.com'` if you used a different email.
    * File: `public/sql/1_admin_update_setup.sql`

## 6. User Management

Administrators can create and manage users through the admin interface:

1. Navigate to `/authuser/admin/management/users`
2. Use the interface to add, edit or delete users
3. Assign appropriate roles to new users (store-manager, vendor-manager)

Users with customer roles can register directly through the customer signup page (`/signup`).

## 7. Session Management

The application uses Supabase Auth for session management. Sessions are maintained across page reloads through cookies. The middleware ensures authentication state is consistently checked across the application.

## 8. Running the Application

1. **Install Dependencies:**

    ```bash
    npm install
    ```

2. **Run Development Server:**

    ```bash
    npm run dev
    ```

    The application should now be running, typically at `http://localhost:3000`.

## 9. Application Structure

The application is structured with the following key areas:

* **/home**: Customer-facing storefront
* **/signin, /signup**: Customer authentication
* **/authuser/signin**: Admin/Staff authentication
* **/authuser/admin/dashboard**: Admin dashboard
* **/authuser/store/dashboard**: Store manager dashboard
* **/authuser/supplier/dashboard**: Vendor manager dashboard
