-- Inserting Electronics
INSERT INTO
    "Products" (
        product_name,
        upc_code,
        size,
        price,
        brand_id,
        product_type_id
    )
VALUES
    (
        'Bluetooth Speaker',
        '123456789013',
        NULL,
        29.99,
        1,
        1
    ),
    (
        'Gaming Laptop',
        '112233445567',
        '15.6 inches',
        1299.99,
        1,
        1
    ),
    ('Smartwatch', '234567890124', NULL, 199.99, 1, 1),
    (
        'Digital Camera',
        '223344556678',
        NULL,
        399.99,
        1,
        1
    ),
    (
        'Wireless Earbuds',
        '345678901235',
        NULL,
        79.99,
        1,
        1
    ),
    (
        'Tablet',
        '334455667789',
        '10 inches',
        249.99,
        1,
        1
    ),
    (
        'External Hard Drive',
        '456789012346',
        '1TB',
        69.99,
        1,
        1
    ),
    (
        'Noise-Cancelling Headphones',
        '445566778890',
        NULL,
        149.99,
        1,
        1
    );

-- Inserting Clothing
INSERT INTO
    "Products" (
        product_name,
        upc_code,
        size,
        price,
        brand_id,
        product_type_id
    )
VALUES
    ('Hoodie', '567890123457', 'Large', 39.99, 26, 2),
    ('Dress', '556677889901', 'Medium', 59.99, 26, 2),
    ('Sneakers', '678901234568', 'US 9', 79.99, 26, 2),
    ('Socks', '667788990012', NULL, 12.99, 26, 2),
    (
        'Swimsuit',
        '789012345679',
        'Small',
        29.99,
        26,
        2
    ),
    ('Jacket', '778899001123', 'Medium', 69.99, 26, 2),
    (
        'Belt',
        '890123456790',
        '36 inches',
        19.99,
        26,
        2
    ),
    ('Hat', '889900112234', NULL, 14.99, 26, 2);

-- Inserting Home & Kitchen
INSERT INTO
    "Products" (
        product_name,
        upc_code,
        size,
        price,
        brand_id,
        product_type_id
    )
VALUES
    (
        'Toaster Oven',
        '901234567891',
        NULL,
        49.99,
        11,
        3
    ),
    ('Microwave', '990011223345', NULL, 99.99, 11, 3),
    (
        'Cookware Set',
        '012345678902',
        '10 pieces',
        129.99,
        11,
        3
    ),
    (
        'Knife Set',
        '001122334456',
        '12 pieces',
        49.99,
        11,
        3
    ),
    (
        'Dinnerware Set',
        '123456789014',
        '16 pieces',
        79.99,
        11,
        3
    ),
    (
        'Cutting Board',
        '112233445568',
        NULL,
        19.99,
        11,
        3
    ),
    (
        'Mixing Bowls',
        '234567890125',
        'Set of 3',
        24.99,
        11,
        3
    ),
    (
        'Baking Sheet',
        '223344556679',
        NULL,
        14.99,
        11,
        3
    );

-- Inserting Sports & Outdoors
INSERT INTO
    "Products" (
        product_name,
        upc_code,
        size,
        price,
        brand_id,
        product_type_id
    )
VALUES
    (
        'Soccer Ball',
        '345678901236',
        'Size 5',
        19.99,
        16,
        4
    ),
    ('Yoga Mat', '334455667790', NULL, 24.99, 16, 4),
    (
        'Bicycle',
        '456789012347',
        '26 inches',
        299.99,
        16,
        4
    ),
    (
        'Camping Tent',
        '445566778891',
        '2 person',
        149.99,
        16,
        4
    ),
    (
        'Hiking Backpack',
        '567890123458',
        '30L',
        79.99,
        16,
        4
    ),
    (
        'Golf Clubs',
        '556677889902',
        'Set of 12',
        499.99,
        16,
        4
    ),
    (
        'Fishing Rod',
        '678901234569',
        '7 feet',
        59.99,
        16,
        4
    ),
    (
        'Ski Goggles',
        '667788990013',
        NULL,
        39.99,
        16,
        4
    );

-- Inserting Beauty & Personal Care 
INSERT INTO
    "Products" (
        product_name,
        upc_code,
        size,
        price,
        brand_id,
        product_type_id
    )
VALUES
    (
        'Conditioner',
        '789012345680',
        '500ml',
        14.99,
        21,
        5
    ),
    (
        'Face Wash',
        '778899001124',
        '150ml',
        12.99,
        21,
        5
    ),
    (
        'Body Lotion',
        '890123456791',
        '250ml',
        19.99,
        21,
        5
    ),
    ('Perfume', '889900112235', '50ml', 79.99, 21, 5),
    (
        'Makeup Brushes',
        '901234567892',
        'Set of 5',
        24.99,
        21,
        5
    ),
    ('Nail Polish', '990011223346', NULL, 9.99, 21, 5),
    ('Hair Dryer', '012345678903', NULL, 39.99, 21, 5),
    (
        'Shaving Cream',
        '001122334457',
        '200ml',
        7.99,
        21,
        5
    );

-- Inserting Toys & Games
INSERT INTO
    "Products" (
        product_name,
        upc_code,
        size,
        price,
        brand_id,
        product_type_id
    )
VALUES
    (
        'Action Figure',
        '123456789015',
        NULL,
        19.99,
        26,
        6
    ),
    ('Doll', '112233445569', NULL, 29.99, 26, 6),
    (
        'Stuffed Animal',
        '234567890126',
        NULL,
        14.99,
        26,
        6
    ),
    (
        'Remote Control Car',
        '223344556680',
        NULL,
        39.99,
        26,
        6
    ),
    (
        'Building Blocks',
        '345678901237',
        '500 pieces',
        49.99,
        26,
        6
    ),
    ('Card Game', '334455667791', NULL, 12.99, 26, 6),
    ('Video Game', '456789012348', NULL, 59.99, 26, 6),
    (
        'Jigsaw Puzzle',
        '445566778892',
        '500 pieces',
        19.99,
        26,
        6
    );

-- Inserting Books & Media
INSERT INTO
    "Products" (
        product_name,
        upc_code,
        size,
        price,
        brand_id,
        product_type_id
    )
VALUES
    (
        'Biography',
        '567890123459',
        'Hardcover',
        24.99,
        31,
        7
    ),
    (
        'Cookbook',
        '556677889903',
        'Paperback',
        19.99,
        31,
        7
    ),
    (
        'Children''s Book',
        '678901234570',
        'Hardcover',
        14.99,
        31,
        7
    ),
    (
        'Art Book',
        '667788990014',
        'Hardcover',
        39.99,
        31,
        7
    ),
    (
        'Travel Guide',
        '789012345681',
        'Paperback',
        12.99,
        31,
        7
    ),
    (
        'Dictionary',
        '778899001125',
        'Hardcover',
        49.99,
        31,
        7
    ),
    ('Magazine', '890123456792', NULL, 4.99, 31, 7),
    ('Comic Book', '889900112236', NULL, 3.99, 31, 7);

-- Inserting Automotive
INSERT INTO
    "Products" (
        product_name,
        upc_code,
        size,
        price,
        brand_id,
        product_type_id
    )
VALUES
    ('Engine Oil', '901234567893', '5L', 29.99, 36, 8),
    ('Air Filter', '990011223347', NULL, 19.99, 36, 8),
    (
        'Brake Pads',
        '012345678904',
        'Set of 4',
        49.99,
        36,
        8
    ),
    (
        'Spark Plugs',
        '001122334458',
        'Set of 4',
        14.99,
        36,
        8
    ),
    (
        'Tires',
        '123456789016',
        '16 inches',
        99.99,
        36,
        8
    ),
    ('Car Cover', '112233445570', NULL, 59.99, 36, 8),
    (
        'Floor Mats',
        '234567890127',
        'Set of 4',
        24.99,
        36,
        8
    ),
    (
        'Steering Wheel Cover',
        '223344556681',
        NULL,
        12.99,
        36,
        8
    );

-- Inserting Pet Supplies
INSERT INTO
    "Products" (
        product_name,
        upc_code,
        size,
        price,
        brand_id,
        product_type_id
    )
VALUES
    ('Cat Food', '345678901238', '5kg', 19.99, 41, 9),
    (
        'Dog Leash',
        '334455667792',
        '6 feet',
        14.99,
        41,
        9
    ),
    ('Cat Toy', '456789012349', NULL, 9.99, 41, 9),
    ('Dog Bed', '445566778893', 'Large', 49.99, 41, 9),
    (
        'Aquarium',
        '567890123460',
        '20 gallons',
        129.99,
        41,
        9
    ),
    ('Fish Food', '556677889904', '100g', 4.99, 41, 9),
    (
        'Bird Cage',
        '678901234571',
        'Small',
        39.99,
        41,
        9
    ),
    ('Bird Seed', '667788990015', '1kg', 9.99, 41, 9);

-- Inserting Office & Stationery
INSERT INTO
    "Products" (
        product_name,
        upc_code,
        size,
        price,
        brand_id,
        product_type_id
    )
VALUES
    (
        'Printer Paper',
        '789012345682',
        '500 sheets',
        9.99,
        46,
        10
    ),
    ('Stapler', '778899001126', NULL, 7.99, 46, 10),
    (
        'Paper Clips',
        '890123456793',
        'Box of 100',
        2.99,
        46,
        10
    ),
    (
        'Sticky Notes',
        '889900112237',
        NULL,
        3.99,
        46,
        10
    ),
    (
        'Highlighters',
        '901234567894',
        'Set of 5',
        4.99,
        46,
        10
    ),
    (
        'Folders',
        '990011223348',
        'Pack of 10',
        5.99,
        46,
        10
    ),
    (
        'Desk Organizer',
        '012345678905',
        NULL,
        19.99,
        46,
        10
    ),
    (
        'Pencil Sharpener',
        '001122334459',
        NULL,
        2.99,
        46,
        10
    );