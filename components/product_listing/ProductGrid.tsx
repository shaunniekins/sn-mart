"use client";

import { fetchViewProductsDetailsData } from "@/app/api/productsData";
import { addToCart } from "@/utils/redux/features/products/cartReducer";
import { useAppDispatch } from "@/utils/redux/hooks";
import { convertUrlFriendlyCategory } from "@/utils/component_functions/conversion";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { fetchViewProductsDetailsFromSpecificStoreData } from "@/app/api/inventoryData";

type Props = {
  productCategory: string;
};

const ProductGrid = ({ productCategory }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const store = useSelector((state: RootState) => state.store);

  useEffect(() => {
    if (!store || !store.selectedStore) return;

    const fetchData = async () => {
      if (store.selectedStore) {
        const data = await fetchViewProductsDetailsFromSpecificStoreData(
          store.selectedStore.store_id,
          productCategory
        );
        if (data !== null) {
          setProducts(data);
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [store, productCategory]);

  const convertedCategory = convertUrlFriendlyCategory(productCategory);

  // redux
  const dispatch = useAppDispatch();

  return (
    <section className="py-10 px-4">
      {isLoading ? (
        <div className="container mx-auto text-center h-full flex items-center justify-center">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="container mx-auto p-4">
          <Breadcrumbs>
            <BreadcrumbItem className="section-link">
              <Link href="\home">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>{convertedCategory}</BreadcrumbItem>
          </Breadcrumbs>
          <h1 className="text-main-theme text-2xl font-bold my-5">
            {convertedCategory}
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-1 md:gap-4 ">
            {products.map((product) => (
              <div
                key={product.product_name}
                className="gridProducts bg-white rounded-lg shadow-md p-4">
                <img
                  src={"/images/sn-mart-logo.jpeg"}
                  alt={product.product_name}
                  className="w-full h-40 object-cover mb-2"
                />
                <Link
                  href={`/products/${productCategory}/${product.product_id}`}
                  className="text-main-theme">
                  <h4 className="text-lg font-medium whitespace-nowrap overflow-ellipsis overflow-hidden text-main-theme">
                    {product.product_name}
                  </h4>
                </Link>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-600">${product.price}</p>

                  <button
                    onClick={() => {
                      dispatch(addToCart(product));
                    }}
                    className="rounded-lg bg-main-theme px-3 py-2 text-white hover:bg-main-hover-theme">
                    <MdOutlineShoppingCart />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
