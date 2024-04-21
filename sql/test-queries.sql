-- Top 20 selling products at each store
SELECT
    p.product_name,
    s.store_name,
    SUM(od.quantity) AS TotalSales
FROM
    "Product" p
    JOIN "OrderDetail" od ON p.product_id = od.product_id
    JOIN "Order" o ON od.order_id = o.order_id
    JOIN "Store" s ON o.store_id = s.store_id
GROUP BY
    p.product_name,
    s.store_name
ORDER BY
    TotalSales DESC
LIMIT
    20;

-- Top 20 selling products in each state
SELECT
    p.product_name,
    s.store_address,
    SUM(od.quantity) AS TotalSales
FROM
    "Product" p
    JOIN "OrderDetail" od ON p.product_id = od.product_id
    JOIN "Order" o ON od.order_id = o.order_id
    JOIN "Store" s ON o.store_id = s.store_id
GROUP BY
    p.product_name,
    s.store_address
ORDER BY
    TotalSales DESC
LIMIT
    20;

-- Top 5 stores with the most sales so far this year
SELECT
    s.store_name,
    SUM(od.quantity * p.price) AS TotalSales
FROM
    "Store" s
    JOIN "Order" o ON s.store_id = o.store_id
    JOIN "OrderDetail" od ON o.order_id = od.order_id
    JOIN "Product" p ON od.product_id = p.product_id
WHERE
    o.OrderDate >= '2023-01-01'
GROUP BY
    s.store_name
ORDER BY
    TotalSales DESC
LIMIT
    5;

-- Comparison of Coke and Pepsi sales
SELECT
    p.product_name,
    SUM(od.quantity) AS TotalSales
FROM
    "Product" p
    JOIN "OrderDetail" od ON p.product_id = od.product_id
WHERE
    p.product_name IN ('Coke', 'Pepsi')
GROUP BY
    p.product_name
ORDER BY
    TotalSales DESC;