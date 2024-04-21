CREATE VIEW view_product_details AS
SELECT
    p.product_id,
    p.product_name,
    p.upc_code,
    p.size,
    p.price,
    b.brand_name,
    pt.type_name AS product_type,
    COALESCE(parent.type_name, '') AS parent_product_type
FROM
    "Products" p
    JOIN "Brands" b ON p.brand_id = b.brand_id
    JOIN "Product_Types" pt ON p.product_type_id = pt.product_type_id
    LEFT JOIN "Product_Types" parent ON pt.parent_type_id = parent.product_type_id;