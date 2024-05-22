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