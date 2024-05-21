CREATE TABLE "Stock_Requests" (
    request_id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES "Stores"(store_id),
    product_id INTEGER REFERENCES "Products"(product_id),
    requested_quantity INTEGER NOT NULL,
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending'
);