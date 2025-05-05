-- Inventory Details View
CREATE VIEW "ViewInventoryDetails" AS
SELECT
    s.store_id,
    s.store_name,
    s.store_location,
    s.store_operating_hours,
    p.product_id,
    p.product_name,
    p.upc_code,
    p.size,
    p.image_url,
    b.brand_name,
    pt.product_type_name,
    p.price,
    i.quantity,
    sr.status
FROM
    public."Inventory" i
    JOIN public."Stores" s ON i.store_id = s.store_id
    JOIN public."Products" p ON i.product_id = p.product_id
    JOIN public."Brands" b ON p.brand_id = b.brand_id
    JOIN public."Product_Types" pt ON p.product_type_id = pt.product_type_id
    LEFT JOIN public."Stock_Requests" sr ON i.store_id = sr.store_id
    AND i.product_id = sr.product_id;

-- Product Details View
CREATE VIEW "ViewProductDetails" AS
SELECT
    p.product_id,
    p.product_name,
    p.upc_code,
    p.size,
    p.price,
    p.image_url,
    b.brand_id,
    b.brand_name,
    pt.product_type_id AS product_type_id,
    pt.product_type_name AS product_type_name,
    pt.image_url AS product_type_image_url 
FROM
    "Products" p
    JOIN "Brands" b ON p.brand_id = b.brand_id
    JOIN "Product_Types" pt ON p.product_type_id = pt.product_type_id;

-- Stock Requests View
CREATE
OR REPLACE VIEW "ViewStockRequests" AS
SELECT
    sr.*,
    v.vendor_name,
    v.vendor_location,
    s.store_name,
    p.product_name,
    i.quantity as inventory_quantity
FROM
    public."Stock_Requests" sr
    LEFT JOIN public."Vendors" v ON sr.vendor_id = v.vendor_id
    LEFT JOIN public."Stores" s ON sr.store_id = s.store_id
    LEFT JOIN public."Products" p ON sr.product_id = p.product_id
    LEFT JOIN public."Inventory" i ON sr.store_id = i.store_id
    AND sr.product_id = i.product_id;

-- Store Details View
CREATE VIEW "ViewStoreDetails" AS
SELECT
    s.store_id,
    s.store_name,
    s.store_location,
    s.store_operating_hours,
    u.id AS manager_id,
    u.email AS manager_email,
    u.raw_user_meta_data ->> 'role' AS manager_role,
    u.raw_user_meta_data ->> 'first_name' AS manager_first_name,
    u.raw_user_meta_data ->> 'last_name' AS manager_last_name
FROM
    auth.users u
    JOIN "Stores" s ON u.id = s.store_manager_id;

-- Brand Details View
CREATE VIEW "ViewUsers" AS
SELECT
    id,
    email,
    created_at,
    raw_user_meta_data ->> 'role' AS role,
    raw_user_meta_data ->> 'last_name' AS last_name,
    raw_user_meta_data ->> 'first_name' AS first_name,
    raw_user_meta_data ->> 'password' AS password
FROM
    auth.users;

-- User Details View
CREATE
OR REPLACE VIEW "ViewRoles" AS
SELECT
    DISTINCT role
FROM
    "ViewUsers"
WHERE
    role IS NOT NULL
ORDER BY
    role ASC;

-- Vendor Details View
CREATE VIEW "ViewVendorDetails" AS
SELECT
    v.vendor_id,
    v.vendor_name,
    v.vendor_location,
    u.id AS vendor_manager_id,
    u.email AS manager_email,
    u.raw_user_meta_data ->> 'role' AS manager_role,
    u.raw_user_meta_data ->> 'first_name' AS manager_first_name,
    u.raw_user_meta_data ->> 'last_name' AS manager_last_name
FROM
    auth.users u
    JOIN "Vendors" v ON u.id = v.vendor_manager_id;