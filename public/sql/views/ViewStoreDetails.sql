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