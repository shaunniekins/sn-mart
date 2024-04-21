# SN Mart Database Design with PostgreSQL

This document outlines a possible implementation of the database for SN Mart using PostgreSQL. The design adheres to the Project2 specifications and focuses on core functionalities.

## 1. Entity-Relationship Diagram (ERD)

- **Products** (product_id [PK], product_name, upc_code, size, brand_id [FK], product_type_id [FK])
  Each product has a unique ID (auto-increment), name, UPC code, size, and references to brand and product type.
- **Brands** (brand_id [PK], brand_name)
  Each brand has a unique ID and name.
- **Product_Types** (product_type_id [PK], type_name, parent_type_id [FK])
  Hierarchical structure with unique ID, type name, and optional reference to a parent type for subcategories.
- **Vendors** (vendor_id [PK], vendor_name)
  Unique ID and name for each vendor.
- **Stores** (store_id [PK], store_name, location, operating_hours)
  Unique ID, name, location, and operating hours for each store.
- **Customers** (customer_id [PK], name, is_member)
  Unique ID, name, and a flag indicating membership in the loyalty program.
- **Inventory** (inventory_id [PK], store_id [FK], product_id [FK], quantity)
  Tracks the quantity of each product at each store, with unique ID and foreign keys to store and product.
- **Sales** (sale_id [PK], customer_id [FK], store_id [FK], sale_date, total_amount)
  Records each sale with unique ID, references to customer and store, date, and total amount.
- **Sale_Items** (sale_item_id [PK], sale_id [FK], product_id [FK], quantity, price)
  Records each item in a sale with unique ID, references to the sale and product, quantity, and price.

#### Relationships:

- Products have a Many-to-One relationship with Brands and Product_Types.
- Product_Types have a One-to-Many (hierarchical) relationship with themselves for subcategories.
- Vendors have a Many-to-Many relationship with Products (a separate table may be needed to represent this).
- Stores have a Many-to-Many relationship with Products through Inventory.
- Customers have a One-to-Many relationship with Sales.
- Stores have a One-to-Many relationship with Sales.
- Sales have a One-to-Many relationship with Sale_Items.
- Sale_Items have a Many-to-One relationship with Products.

## 2. PostgreSQL Schema Creation

```
-- Products Table
CREATE TABLE Products (
product_id SERIAL PRIMARY KEY,
product_name VARCHAR(255) NOT NULL,
upc_code VARCHAR(12) UNIQUE NOT NULL,
size VARCHAR(50),
brand_id INTEGER REFERENCES Brands(brand_id),
product_type_id INTEGER REFERENCES Product_Types(product_type_id)
);
```

```
-- Brands Table
CREATE TABLE Brands (
brand_id SERIAL PRIMARY KEY,
brand_name VARCHAR(255) UNIQUE NOT NULL
);
```

```
-- Product Types Table
CREATE TABLE Product_Types (
product_type_id SERIAL PRIMARY KEY,
type_name VARCHAR(255) NOT NULL,
parent_type_id INTEGER REFERENCES Product_Types(product_type_id)
);
```

```
-- Vendors Table
CREATE TABLE Vendors (
vendor_id SERIAL PRIMARY KEY,
vendor_name VARCHAR(255) UNIQUE NOT NULL
);
```

```
-- Stores Table
CREATE TABLE Stores (
store_id SERIAL PRIMARY KEY,
store_name VARCHAR(255) NOT NULL,
location VARCHAR(255),
operating_hours VARCHAR(255)
);
```

```
-- Customers Table
CREATE TABLE Customers (
customer_id SERIAL PRIMARY KEY,
name VARCHAR(255),
is_member BOOLEAN
);
```

```
-- Inventory Table
CREATE TABLE Inventory (
inventory_id SERIAL PRIMARY KEY,
store_id INTEGER REFERENCES Stores(store_id),
product_id INTEGER REFERENCES Products(product_id),
quantity INTEGER DEFAULT 0,
UNIQUE (store_id, product_id)
);

```

```
-- Sales Table
CREATE TABLE Sales (
sale_id SERIAL PRIMARY KEY,
customer_id INTEGER REFERENCES Customers(customer_id),
store_id INTEGER REFERENCES Stores(store_id),
sale_date DATE NOT NULL,
total_amount DECIMAL(10, 2) NOT NULL
);

```

```
-- Sale Items Table
CREATE TABLE Sale_Items (
sale_item_id SERIAL PRIMARY KEY,
sale_id INTEGER REFERENCES Sales(sale_id),
product_id INTEGER REFERENCES Products(product_id),
quantity INTEGER NOT NULL,
price DECIMAL(10, 2) NOT NULL
);
```

## 3. Additional Considerations

- **Indices**: Add indices to columns frequently used in queries for faster retrieval (e.g., product_name, upc_code, brand_id, etc.).
- **Constraints**: Implement foreign key constraints to maintain referential integrity. Consider adding CHECK constraints for data validity (e.g., quantity >= 0 in Inventory).
- **Many-to-Many Relationships**: For Vendors and Products, create a separate table to represent the relationship, with foreign keys to both tables.
- **Data Population**: Develop scripts or use tools to populate the tables with realistic test data. Ensure data consistency across related tables.
- **Triggers/Functions**: Implement triggers for automatic inventory updates after sales or shipments. Create functions for complex business logic or calculations.
- **Online Orders**: Add a separate table or flag in the Stores table to distinguish online orders from in-store purchases. Ensure online orders are associated with customers and have no anonymous customers.
- **Reorder Management**: Create tables to handle reorder requests, track shipments, associate shipments with purchase orders, and update inventory based on shipment arrivals.
- **Vendor Shipments**: Add tables to store vendor shipment details, delivery dates, and associate them with corresponding reorder requests or purchase orders.
- **Frequent Shopper Program Data**: Consider adding additional columns or a separate table to store personal information provided by customers when joining the frequent shopper program.
- **Product Pricing**: Implement a mechanism to store and manage store-specific pricing for products, either in the Products table or a separate table.
- **Many-to-Many Relationship between Vendors and Products**: Create a separate table to represent the many-to-many relationship between Vendors and Products, with foreign keys to both tables.

## 4. Example Queries

- Top 20 Products by Store:

```
SELECT p.product_name, SUM(si.quantity) AS total_sold
FROM Sale_Items si
JOIN Products p ON si.product_id = p.product_id
JOIN Sales s ON si.sale_id = s.sale_id
WHERE s.store_id = 1 -- Replace with desired store ID
GROUP BY p.product_name
ORDER BY total_sold DESC
LIMIT 20;
```

- Stores with Highest Sales:

```
SELECT st.store_name, SUM(s.total_amount) AS total_sales
FROM Sales s
JOIN Stores st ON s.store_id = st.store_id
GROUP BY st.store_name
ORDER BY total_sales DESC
LIMIT 5;
```
