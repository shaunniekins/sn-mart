type Product = {
  store_id: number;
  product_id: number;
  product_name: string;
  upc_code: string;
  size: string;
  brand_id: number;
  brand_name: string;
  product_type_id: number;
  product_type_name: string;
  price: number;
  quantity: number;
};

type Store = {
  store_id: number;
  store_name: string;
  store_location: string;
  store_operating_hours: string;
  manager_id: string;
  manager_email: string;
  manager_role: string;
  manager_first_name: string;
  manager_last_name: string;
};
