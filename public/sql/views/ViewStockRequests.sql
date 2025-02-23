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