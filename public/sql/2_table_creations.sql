-- Brands Table
CREATE TABLE "Brands" (
    brand_id SERIAL PRIMARY KEY,
    brand_name VARCHAR(255) UNIQUE NOT NULL
);

-- Stores Table
CREATE TABLE "Stores" (
    store_id SERIAL PRIMARY KEY,
    store_name VARCHAR(255) NOT NULL,
    store_location VARCHAR(255) NOT NULL,
    store_operating_hours VARCHAR(255),
    store_manager_id UUID NOT NULL,
    CONSTRAINT Stores_store_manager_id_fkey FOREIGN KEY (store_manager_id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE
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
    vendor_name VARCHAR(255) UNIQUE NOT NULL,
    vendor_location VARCHAR(255) NOT NULL,
    vendor_manager_id UUID NOT NULL,
    CONSTRAINT Vendors_vendor_manager_id_fkey FOREIGN KEY (vendor_manager_id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Profiles Table (Linked to auth.users)
CREATE TABLE "Profiles" (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    role TEXT
);

-- Product Types Table
CREATE TABLE "Product_Types" (
    product_type_id SERIAL PRIMARY KEY,
    product_type_name VARCHAR(255) NOT NULL,
    parent_type_id INTEGER NULL,
    CONSTRAINT Product_Types_parent_type_id_fkey FOREIGN KEY (parent_type_id) REFERENCES "Product_Types" (product_type_id)
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

-- Stock Requests Table
CREATE TABLE "Stock_Requests" (
    request_id SERIAL,
    store_id INTEGER NULL,
    product_id INTEGER NULL,
    vendor_id INTEGER NULL,
    requested_quantity INTEGER NOT NULL,
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status CHARACTER VARYING(20) NOT NULL DEFAULT 'Pending' :: CHARACTER VARYING,
    CONSTRAINT Stock_Requests_pkey PRIMARY KEY (request_id),
    CONSTRAINT Stock_Requests_product_id_fkey FOREIGN KEY (product_id) REFERENCES "Products" (product_id),
    CONSTRAINT Stock_Requests_store_id_fkey FOREIGN KEY (store_id) REFERENCES "Stores" (store_id),
    CONSTRAINT Stock_Requests_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES "Vendors" (vendor_id) ON UPDATE CASCADE ON DELETE CASCADE
) TABLESPACE pg_default;