-- Top 20 selling products at each store
SELECT
    p.product_name,
    s.store_name,
    SUM(si.quantity) AS TotalSales
FROM
    "Products" p
    JOIN "Sale_Items" si ON p.product_id = si.product_id
    JOIN "Sales" sa ON si.sale_id = sa.sale_id
    JOIN "Stores" s ON sa.store_id = s.store_id
GROUP BY
    p.product_name,
    s.store_name
ORDER BY
    TotalSales DESC
LIMIT
    20;

-- Top 20 selling products in each state/location
SELECT
    p.product_name,
    s.store_location,
    SUM(si.quantity) AS TotalSales
FROM
    "Products" p
    JOIN "Sale_Items" si ON p.product_id = si.product_id
    JOIN "Sales" sa ON si.sale_id = sa.sale_id
    JOIN "Stores" s ON sa.store_id = s.store_id
GROUP BY
    p.product_name,
    s.store_location
ORDER BY
    TotalSales DESC
LIMIT
    20;

-- Top 5 stores with the most sales so far this year
SELECT
    s.store_name,
    SUM(si.quantity * p.price) AS TotalSales
FROM
    "Stores" s
    JOIN "Sales" sa ON s.store_id = sa.store_id
    JOIN "Sale_Items" si ON sa.sale_id = si.sale_id
    JOIN "Products" p ON si.product_id = p.product_id
WHERE
    sa.sale_date >= '2023-01-01'
GROUP BY
    s.store_name
ORDER BY
    TotalSales DESC
LIMIT
    5;

-- Comparison of Coke and Pepsi sales (Assuming 'Coke' and 'Pepsi' are product names)
SELECT
    p.product_name,
    SUM(si.quantity) AS TotalSales
FROM
    "Products" p
    JOIN "Sale_Items" si ON p.product_id = si.product_id
WHERE
    p.product_name IN ('Coke', 'Pepsi') -- Make sure these product names exist in your "Products" table
GROUP BY
    p.product_name
ORDER BY
    TotalSales DESC;