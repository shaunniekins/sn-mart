-- Drop all views
DROP VIEW IF EXISTS 
  "ViewInventoryDetails", "ViewProductDetails", "ViewRoles", "ViewStockRequests", 
  "ViewStoreDetails", "ViewUsers", "ViewVendorDetails", "View_Products", "View_Stock_Requests", "View_Store_Inventory",
  CASCADE;


-- Drop all tables
DROP TABLE IF EXISTS 
  "Brands", "Customers", "Inventory", "Product_Types", "Product_Vendors",
  "Products", "Sale_Items", "Sales", "Stock_Requests", "Stores", "Vendors", "Profiles",
  CASCADE;

