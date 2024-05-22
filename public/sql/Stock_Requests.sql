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