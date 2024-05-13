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
    b.brand_name,
    pt.product_type_name,
    p.price,
    i.quantity
FROM
    public."Inventory" i
    JOIN public."Stores" s ON i.store_id = s.store_id
    JOIN public."Products" p ON i.product_id = p.product_id
    JOIN public."Brands" b ON p.brand_id = b.brand_id
    JOIN public."Product_Types" pt ON p.product_type_id = pt.product_type_id;