-- BRAND
INSERT INTO
    "Brand" (brand_id, brand_name)
VALUES
    (1, 'Coca-Cola'),
    (2, 'Pepsi'),
    (3, 'Frito-Lay'),
    (4, 'Nestle'),
    (5, 'Kellogg''s'),
    (6, 'Hershey''s'),
    (7, 'Mars'),
    (8, 'Unilever'),
    (9, 'Procter & Gamble'),
    (10, 'Johnson & Johnson'),
    (11, 'Kraft Heinz'),
    (12, 'General Mills'),
    (13, 'Mondelez'),
    (14, 'Danone'),
    (15, 'Conagra'),
    (16, 'Campbell Soup'),
    (17, 'Tyson Foods'),
    (18, 'Smucker''s'),
    (19, 'McCormick'),
    (20, 'Clorox');

-- ProductType
INSERT INTO
    "ProductType" (product_type_id, product_type_name)
VALUES
    (1, 'Beverages'),
    (2, 'Snacks'),
    (3, 'Candy'),
    (4, 'Dairy'),
    (5, 'Frozen Foods'),
    (6, 'Bakery'),
    (7, 'Canned Goods'),
    (8, 'Household Supplies'),
    (9, 'Personal Care'),
    (10, 'Pet Supplies'),
    (11, 'Paper Products'),
    (12, 'Cleaning Supplies'),
    (13, 'Health & Beauty'),
    (14, 'Baby Products'),
    (15, 'Automotive'),
    (16, 'Office Supplies'),
    (17, 'Hardware'),
    (18, 'Toys & Games'),
    (19, 'Seasonal'),
    (20, 'Electronics');

-- Vendor
INSERT INTO
    "Vendor" (vendor_id, vendor_name)
VALUES
    (1, 'Coca-Cola Co.'),
    (2, 'PepsiCo'),
    (3, 'Frito-Lay Inc.'),
    (4, 'Nestle USA'),
    (5, 'Kellogg''s Co.'),
    (6, 'Hershey Foods'),
    (7, 'Mars Inc.'),
    (8, 'Unilever US'),
    (9, 'P&G'),
    (10, 'Johnson & Johnson'),
    (11, 'Kraft Heinz Co.'),
    (12, 'General Mills Inc.'),
    (13, 'Mondelez Intl.'),
    (14, 'Danone SA'),
    (15, 'Conagra Brands'),
    (16, 'Campbell Soup Co.'),
    (17, 'Tyson Foods Inc.'),
    (18, 'J.M. Smucker Co.'),
    (19, 'McCormick & Co.'),
    (20, 'Clorox Co.');

-- Store
INSERT INTO
    "Store" (store_id, store_name, store_address, store_hours)
VALUES
    (
        1,
        'Corner Mart',
        '123 Main St, Springfield',
        '7AM-10PM'
    ),
    (
        2,
        'Quick Stop',
        '456 Oak Ave, Anytown',
        '6AM-11PM'
    ),
    (
        3,
        'EZ Mart',
        '789 Pine St, Hill Valley',
        '24 Hours'
    ),
    (
        4,
        'Neighborhood Grocer',
        '1010 Birch Rd, Riverwood',
        '8AM-9PM'
    ),
    (
        5,
        'The Convenience Store',
        '1112 Cedar St, Wood Creek',
        '7AM-10PM'
    ),
    (
        6,
        'Stop & Go',
        '1314 Willow St, Brookhaven',
        '6AM-11PM'
    ),
    (
        7,
        'Fresh Market',
        '1516 Maple St, Green Valley',
        '24 Hours'
    ),
    (
        8,
        'City Convenience',
        '1718 Oakwood Ln, Urban Center',
        '8AM-9PM'
    ),
    (
        9,
        'The Local Shop',
        '1920 Pinewood Dr, Forest Hills',
        '7AM-10PM'
    ),
    (
        10,
        'Mart & More',
        '2122 Cedarwood Ave, Pinewood',
        '6AM-11PM'
    ),
    (
        11,
        'Quick Pick',
        '2324 Willowbrook Rd, Lakeside',
        '24 Hours'
    ),
    (
        12,
        'Food Stop',
        '2526 Maplewood St, Bayview',
        '8AM-9PM'
    ),
    (
        13,
        'Town Market',
        '2728 Oakdale Ave, Mountain View',
        '7AM-10PM'
    ),
    (
        14,
        'The Corner Store',
        '2930 Pinecrest Dr, Valley View',
        '6AM-11PM'
    ),
    (
        15,
        'Fresh & Fast',
        '3132 Cedar Ridge Rd, Hilltop',
        '24 Hours'
    ),
    (
        16,
        'City Market',
        '3334 Willow Creek Ln, Riverbend',
        '8AM-9PM'
    ),
    (
        17,
        'The Neighborhood Shop',
        '3536 Maplewood Ave, Woodland',
        '7AM-10PM'
    ),
    (
        18,
        'Mart On The Go',
        '3738 Oakwood Dr, Brookside',
        '6AM-11PM'
    ),
    (
        19,
        'Quick Bite',
        '3940 Pinewood Ln, Green Hills',
        '24 Hours'
    ),
    (
        20,
        'The Daily Stop',
        '4142 Cedarwood Rd, Bayside',
        '8AM-9PM'
    );

-- Customer
INSERT INTO
    "Customer" (
        customer_id,
        customer_name,
        customer_address,
        customer_phone_number,
        customer_email
    )
VALUES
    (
        1,
        'John Smith',
        '123 Main St, Springfield',
        '555-123-4567',
        'john.smith@emailworld.com'
    ),
    (
        2,
        'Alice Johnson',
        '456 Oak Ave, Anytown',
        '555-234-5678',
        'alice.johnson@emailworld.com'
    ),
    (
        3,
        'Bob Williams',
        '789 Pine St, Hill Valley',
        '555-345-6789',
        'bob.williams@emailworld.com'
    ),
    (
        4,
        'Carol Brown',
        '1010 Birch Rd, Riverwood',
        '555-456-7890',
        'carol.brown@emailworld.com'
    ),
    (
        5,
        'David Davis',
        '1112 Cedar St, Wood Creek',
        '555-567-8901',
        'david.davis@emailworld.com'
    ),
    (
        6,
        'Emily Garcia',
        '1314 Willow St, Brookhaven',
        '555-678-9012',
        'emily.garcia@emailworld.com'
    ),
    (
        7,
        'Frank Rodriguez',
        '1516 Maple St, Green Valley',
        '555-789-0123',
        'frank.rodriguez@emailworld.com'
    ),
    (
        8,
        'Grace Wilson',
        '1718 Oakwood Ln, Urban Center',
        '555-890-1234',
        'grace.wilson@emailworld.com'
    ),
    (
        9,
        'Henry Martinez',
        '1920 Pinewood Dr, Forest Hills',
        '555-901-2345',
        'henry.martinez@emailworld.com'
    ),
    (
        10,
        'Isabella Anderson',
        '2122 Cedarwood Ave, Pinewood',
        '555-012-3456',
        'isabella.anderson@emailworld.com'
    ),
    (
        11,
        'Jack Thomas',
        '2324 Willowbrook Rd, Lakeside',
        '555-112-4567',
        'jack.thomas@emailworld.com'
    ),
    (
        12,
        'Katie Hernandez',
        '2526 Maplewood St, Bayview',
        '555-213-5678',
        'katie.hernandez@emailworld.com'
    ),
    (
        13,
        'Michael Moore',
        '2728 Oakdale Ave, Mountain View',
        '555-314-6789',
        'michael.moore@emailworld.com'
    ),
    (
        14,
        'Linda Jackson',
        '2930 Pinecrest Dr, Valley View',
        '555-415-7890',
        'linda.jackson@emailworld.com'
    ),
    (
        15,
        'Matthew Taylor',
        '3132 Cedar Ridge Rd, Hilltop',
        '555-516-8901',
        'matthew.taylor@emailworld.com'
    ),
    (
        16,
        'Nicole Lee',
        '3334 Willow Creek Ln, Riverbend',
        '555-617-9012',
        'nicole.lee@emailworld.com'
    ),
    (
        17,
        'Christopher Perez',
        '3536 Maplewood Ave, Woodland',
        '555-718-0123',
        'christopher.perez@emailworld.com'
    ),
    (
        18,
        'Jennifer Clark',
        '3738 Oakwood Dr, Brookside',
        '555-819-1234',
        'jennifer.clark@emailworld.com'
    ),
    (
        19,
        'Daniel Lewis',
        '3940 Pinewood Ln, Green Hills',
        '555-920-2345',
        'daniel.lewis@emailworld.com'
    ),
    (
        20,
        'Brittany Robinson',
        '4142 Cedarwood Rd, Bayside',
        '555-021-3456',
        'brittany.robinson@emailworld.com'
    );

-- Product
INSERT INTO
    "Product" (
        product_id,
        product_name,
        upc,
        price,
        quantity_on_hand,
        reorder_level,
        vendor_id,
        brand_id,
        product_type_id
    )
VALUES
    (
        1,
        'Coca-Cola Classic',
        '123456789012',
        2.99,
        50,
        10,
        1,
        1,
        1
    ),
    (
        2,
        'Pepsi Cola',
        '098765432109',
        2.89,
        45,
        10,
        2,
        2,
        1
    ),
    (
        3,
        'Lay''s Classic Potato Chips',
        '135792468012',
        3.99,
        30,
        5,
        3,
        3,
        2
    ),
    (
        4,
        'Doritos Nacho Cheese',
        '246801357924',
        4.29,
        25,
        5,
        3,
        3,
        2
    ),
    (
        5,
        'KitKat Chocolate Bar',
        '147258369012',
        1.49,
        70,
        20,
        4,
        4,
        3
    ),
    (
        6,
        'Hershey''s Milk Chocolate Bar',
        '258369147024',
        1.29,
        65,
        20,
        6,
        6,
        3
    ),
    (
        7,
        'M&M''s Milk Chocolate',
        '159357753012',
        1.99,
        55,
        15,
        7,
        7,
        3
    ),
    (
        8,
        'Snickers Chocolate Bar',
        '357159268042',
        1.59,
        60,
        15,
        7,
        7,
        3
    ),
    (
        9,
        'Dove Soap',
        '120369852147',
        3.49,
        40,
        10,
        8,
        8,
        9
    ),
    (
        10,
        'Tide Laundry Detergent',
        '240681357902',
        12.99,
        20,
        5,
        9,
        9,
        12
    ),
    (
        11,
        'Bounty Paper Towels',
        '147025836912',
        5.99,
        15,
        3,
        9,
        9,
        11
    ),
    (
        12,
        'Kraft Mac & Cheese',
        '258147036924',
        0.99,
        100,
        20,
        11,
        11,
        7
    ),
    (
        13,
        'Cheerios Cereal',
        '135246078912',
        4.49,
        25,
        5,
        12,
        12,
        6
    ),
    (
        14,
        'Oreo Cookies',
        '246357189024',
        3.79,
        35,
        8,
        13,
        13,
        2
    ),
    (
        15,
        'Activia Yogurt',
        '159478263012',
        1.29,
        50,
        10,
        14,
        14,
        4
    ),
    (
        16,
        'Healthy Choice Frozen Dinner',
        '369258147024',
        3.99,
        20,
        5,
        15,
        15,
        5
    ),
    (
        17,
        'Campbell''s Chicken Noodle Soup',
        '179532468012',
        1.19,
        40,
        10,
        16,
        16,
        7
    ),
    (
        18,
        'Tyson Chicken Nuggets',
        '281647035924',
        6.99,
        15,
        3,
        17,
        17,
        5
    ),
    (
        19,
        'Smucker''s Strawberry Jam',
        '190283746512',
        2.49,
        30,
        8,
        18,
        18,
        6
    ),
    (
        20,
        'McCormick Garlic Powder',
        '201398567424',
        3.29,
        25,
        5,
        19,
        19,
        7
    );

-- Order
INSERT INTO
    "Order" (order_id, customer_id, store_id, OrderDate)
VALUES
    (1, 1, 1, '2023-11-01 10:15:00'),
    (2, 2, 3, '2023-11-02 14:30:00'),
    (3, 5, 2, '2023-11-03 09:45:00'),
    (4, 3, 4, '2023-11-04 18:20:00'),
    (5, 7, 5, '2023-11-05 12:00:00'),
    (6, 9, 1, '2023-11-06 15:15:00'),
    (7, 4, 3, '2023-11-07 20:45:00'),
    (8, 8, 2, '2023-11-08 11:30:00'),
    (9, 6, 4, '2023-11-09 17:20:00'),
    (10, 10, 5, '2023-11-10 13:00:00'),
    (11, 1, 1, '2023-11-11 16:15:00'),
    (12, 2, 3, '2023-11-12 21:45:00'),
    (13, 5, 2, '2023-11-13 12:30:00'),
    (14, 3, 4, '2023-11-14 19:20:00'),
    (15, 7, 5, '2023-11-15 14:00:00'),
    (16, 9, 1, '2023-11-16 17:15:00'),
    (17, 4, 3, '2023-11-17 22:45:00'),
    (18, 8, 2, '2023-11-18 13:30:00'),
    (19, 6, 4, '2023-11-19 20:20:00'),
    (20, 10, 5, '2023-11-20 15:00:00');

-- OrderDetails
INSERT INTO
    "OrderDetail" (order_id, product_id, quantity)
VALUES
    (1, 1, 2),
    (1, 3, 1),
    (2, 5, 3),
    (2, 7, 2),
    (3, 12, 4),
    (3, 15, 2),
    (4, 2, 1),
    (4, 4, 2),
    (5, 9, 1),
    (5, 10, 1),
    (6, 1, 3),
    (6, 3, 1),
    (7, 5, 4),
    (7, 7, 3),
    (8, 12, 5),
    (8, 15, 3),
    (9, 2, 2),
    (9, 4, 3),
    (10, 9, 2),
    (10, 10, 2),
    (11, 1, 4),
    (11, 3, 2),
    (12, 5, 5),
    (12, 7, 4),
    (13, 12, 6),
    (13, 15, 4),
    (14, 2, 3),
    (14, 4, 4),
    (15, 9, 3),
    (15, 10, 3),
    (16, 1, 5),
    (16, 3, 3),
    (17, 5, 6),
    (17, 7, 5),
    (18, 12, 7),
    (18, 15, 5),
    (19, 2, 4),
    (19, 4, 5),
    (20, 9, 4),
    (20, 10, 4);