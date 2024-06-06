"use client";

import Link from "next/link";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import React, { useEffect, useRef, useState } from "react";

import { categories } from "@/utils/data/categories";
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

const ProductCategories = () => {
  const [products, setProducts] = useState<{ [key: string]: Product[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  const store = useSelector((state: RootState) => state.store);

  // useEffect(() => {
  //   console.log("products", products);
  // }, [products]);

  useEffect(() => {
    const fetchData = async () => {
      const productsByCategory: { [key: string]: Product[] } = {};

      for (const category of categories.slice(0, 4)) {
        if (!store || !store.selectedStore) {
          const data = await fetchViewProductsDetailsData(category.name);
          if (data !== null) {
            productsByCategory[category.name] = data;
          }
        } else {
          const data = await fetchViewProductsDetailsFromSpecificStoreData(
            store.selectedStore.store_id,
            category.name
          );
          if (data !== null) {
            productsByCategory[category.name] = data;
          }
        }
      }

      setProducts(productsByCategory);
      setIsLoading(false);
    };

    fetchData();
  }, [store, categories]);

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
          <Carousel
            responsive={responsiveCategories}
            autoPlay={true}
            swipeable={true}
            draggable={true}
            showDots={true}
            infinite={true}
            partialVisible={false}
            className="z-0">
            {categories.map((category) => (
              <Link href={category.link} key={category.name}>
                <div
                  key={category.name}
                  className="bg-white rounded-lg shadow-md overflow-hidden slider">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-main-theme">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </Carousel>

          <div className="mt-4 flex flex-col">
            {categories.slice(0, 4).map((category) => (
              <React.Fragment key={category.name}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-main-theme ">
                    {category.name}
                  </h2>

                  <Link href={category.link} key={category.name}>
                    <h3 className="text-sm text-gray-800 ">See More</h3>
                  </Link>
                </div>
                {products[category.name] &&
                products[category.name].length > 0 ? (
                  <Carousel
                    responsive={responsiveProducts}
                    autoPlay={false}
                    swipeable={true}
                    draggable={true}
                    showDots={false}
                    infinite={true}
                    partialVisible={false}
                    className="z-0">
                    {products[category.name] &&
                      products[category.name].length > 0 &&
                      products[category.name].map((product) => (
                        <div
                          key={product.product_name}
                          className="sliderProducts bg-white rounded-lg shadow-md p-4">
                          <img
                            src={"/images/sn-mart-logo.jpeg"}
                            alt={product.product_name}
                            className="w-full h-40 object-cover mb-2"
                          />
                          <Link
                            href={`/products/${category.route}/${product.product_id}`}
                            className="text-main-theme">
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
                              }`}>
                              {product.quantity === 0
                                ? "Out of Stock"
                                : `$ ${product.price}`}
                            </p>
                            <AddToCartButton
                              product={product}
                              isDisabled={product.quantity === 0}
                            />
                          </div>
                        </div>
                      ))}
                  </Carousel>
                ) : (
                  <div className="-mt-4 mb-4  text-gray-400">
                    No products found for this category.
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductCategories;
