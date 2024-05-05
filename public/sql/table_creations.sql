-- Brands Table
CREATE TABLE "Brands" (
    brand_id SERIAL PRIMARY KEY,
    brand_name VARCHAR(255) UNIQUE NOT NULL
);

-- Stores Table
CREATE TABLE "Stores" (
    store_id SERIAL PRIMARY KEY,
    store_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    operating_hours VARCHAR(255)
);

-- Customers Table
CREATE TABLE "Customers" (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    is_member BOOLEAN
);

-- Vendors Table
CREATE TABLE "Vendors" (
    vendor_id SERIAL PRIMARY KEY,
    vendor_name VARCHAR(255) UNIQUE NOT NULL
);

-- Product Types Table
CREATE TABLE "Product_Types" (
    product_type_id SERIAL PRIMARY KEY,
    product_type_name VARCHAR(255) NOT NULL
);

-- Products Table
CREATE TABLE "Products" (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    upc_code VARCHAR(12) UNIQUE NOT NULL,
    size VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    brand_id INTEGER REFERENCES "Brands"(brand_id),
    product_type_id INTEGER REFERENCES "Product_Types"(product_type_id)
);

-- Product Vendors Table
CREATE TABLE "Product_Vendors" (
    product_id INTEGER REFERENCES "Products"(product_id),
    vendor_id INTEGER REFERENCES "Vendors"(vendor_id),
    PRIMARY KEY (product_id, vendor_id)
);

-- Inventory Table
CREATE TABLE "Inventory" (
    inventory_id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES "Stores"(store_id),
    product_id INTEGER REFERENCES "Products"(product_id),
    quantity INTEGER DEFAULT 0,
    UNIQUE (store_id, product_id)
);

-- Sales Table
CREATE TABLE "Sales" (
    sale_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES "Customers"(customer_id),
    store_id INTEGER REFERENCES "Stores"(store_id),
    sale_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL
);

-- Sale Items Table
CREATE TABLE "Sale_Items" (
    sale_item_id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES "Sales"(sale_id),
    product_id INTEGER REFERENCES "Products"(product_id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);