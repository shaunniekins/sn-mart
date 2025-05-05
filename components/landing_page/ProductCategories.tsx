"use client";

import Link from "next/link";
import Image from "next/image";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import React, { useEffect, useState } from "react";

import { fetchViewProductsDetailsData } from "@/app/api/productsData";
import {
  responsiveCategories,
  responsiveProducts,
} from "@/utils/component_functions/carouselFunctions";

import {
  addToCart,
  updateQuantity,
} from "@/utils/redux/features/products/cartReducer";
import { useAppDispatch } from "@/utils/redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { fetchViewProductsDetailsFromSpecificStoreData } from "@/app/api/inventoryData";
import AddToCartButton from "../AddToCartButton";
import { fetchProductTypesData } from "@/app/api/productTypesData";
import { convertUrlFriendlyCategory } from "@/utils/component_functions/conversion";

// Local URL friendly conversion function as a fallback
const makeUrlFriendly = (text: string): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

type ProductType = {
  product_type_id: number;
  product_type_name: string;
  image_url?: string | null;
};

const ProductCategories = () => {
  const [products, setProducts] = useState<{ [key: string]: Product[] }>({});
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const store = useSelector((state: RootState) => state.store);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const typesData = await fetchProductTypesData();
      if (typesData) {
        setProductTypes(typesData as ProductType[]);

        const productsByCategory: { [key: string]: Product[] } = {};
        for (const category of typesData as ProductType[]) {
          const categoryName = category.product_type_name;
          let productData: Product[] | null = null;

          if (!store || !store.selectedStore) {
            console.warn(
              "No store selected, product fetching might be limited."
            );
          } else {
            productData = await fetchViewProductsDetailsFromSpecificStoreData(
              store.selectedStore.store_id,
              categoryName
            );
          }

          if (productData !== null) {
            productsByCategory[categoryName] = productData;
          } else {
            productsByCategory[categoryName] = [];
          }
        }
        setProducts(productsByCategory);
      } else {
        console.error("Failed to fetch product types.");
      }

      setIsLoading(false);
    };

    fetchData();
  }, [store]);

  return (
    <section className="py-10 px-4 z-0">
      {isLoading ? (
        <div className="container mx-auto text-center">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-main-theme mb-6">
            Browse by Category
          </h2>
          {productTypes.length > 0 ? (
            <Carousel
              responsive={responsiveCategories}
              autoPlay={true}
              swipeable={true}
              draggable={true}
              showDots={true}
              infinite={true}
              partialVisible={false}
              className="z-0"
            >
              {productTypes.map((category) => {
                const categoryRoute = makeUrlFriendly(
                  category.product_type_name
                );
                return (
                  <Link
                    href={`/products/${categoryRoute}`}
                    key={category.product_type_id}
                  >
                    <div
                      key={category.product_type_id}
                      className="bg-white rounded-lg shadow-md overflow-hidden slider"
                    >
                      <img
                        src={category.image_url || "/images/sn-mart-logo.jpeg"}
                        alt={category.product_type_name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-main-theme">
                          {category.product_type_name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </Carousel>
          ) : (
            <p className="text-gray-500">No categories found.</p>
          )}

          <div className="mt-4 flex flex-col">
            {productTypes
              .filter((category) => {
                const categoryProducts =
                  products[category.product_type_name] || [];
                return categoryProducts.length > 0;
              })
              .map((category) => {
                const categoryRoute = makeUrlFriendly(
                  category.product_type_name
                );
                const categoryProducts =
                  products[category.product_type_name] || [];

                return (
                  <React.Fragment key={category.product_type_id}>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-main-theme ">
                        {category.product_type_name}
                      </h2>
                      <Link href={`/products/${categoryRoute}`}>
                        <h3 className="text-sm text-gray-800 ">See More</h3>
                      </Link>
                    </div>
                    <Carousel
                      responsive={responsiveProducts}
                      autoPlay={false}
                      swipeable={true}
                      draggable={true}
                      showDots={false}
                      infinite={categoryProducts.length > 5}
                      partialVisible={false}
                      className="z-0"
                    >
                      {categoryProducts.map((product) => (
                        <div
                          key={product.product_id}
                          className="sliderProducts bg-white rounded-lg shadow-md p-4"
                        >
                          <Image
                            src={
                              product.image_url || "/images/sn-mart-logo.jpeg"
                            }
                            alt={product.product_name}
                            width={200}
                            height={160}
                            className="w-full h-40 object-cover mb-2 rounded-md"
                          />
                          <Link
                            href={`/products/${categoryRoute}/${product.product_id}`}
                            className="text-main-theme"
                          >
                            <h4 className="text-lg font-medium whitespace-nowrap overflow-ellipsis overflow-hidden text-main-theme">
                              {product.product_name}
                            </h4>
                          </Link>
                          <div className="flex justify-between items-center mt-2">
                            <p
                              className={`${
                                product.quantity === 0
                                  ? "text-red-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {product.quantity === 0
                                ? "Out of Stock"
                                : `$${product.price}`}
                            </p>
                            <AddToCartButton
                              product={product}
                              isDisabled={product.quantity === 0}
                            />
                          </div>
                        </div>
                      ))}
                    </Carousel>
                  </React.Fragment>
                );
              })}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductCategories;
