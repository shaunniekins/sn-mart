// ProductCategories.tsx

"use client";

import Link from "next/link";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { MdOutlineShoppingCart } from "react-icons/md";
import React, { useEffect, useRef, useState } from "react";

import { categories } from "@/src/data/categories";
import { fetchViewProductsDetailsData } from "@/src/api/productsData";
import {
  responsiveCategories,
  responsiveProducts,
} from "@/src/utils/carouselFunctions";

import type { RootState } from "@/src/redux/store";
import {
  addToCart,
  updateQuantity,
} from "@/src/redux/features/products/cartReducer";
import { useAppDispatch } from "@/src/redux/hooks";

const ProductCategories = () => {
  const [products, setProducts] = useState<{ [key: string]: Product[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const productsByCategory: { [key: string]: Product[] } = {};

      for (const category of categories.slice(0, 4)) {
        const data = await fetchViewProductsDetailsData(category.name);
        if (data !== null) {
          productsByCategory[category.name] = data;
        }
      }

      setProducts(productsByCategory);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // redux
  const dispatch = useAppDispatch();

  return (
    <section className="py-10 px-4 z-0">
      {isLoading ? (
        <div className="container mx-auto text-center">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-purple-700 mb-6">
            Browse by Category
          </h2>
          <Carousel
            responsive={responsiveCategories}
            autoPlay={true}
            swipeable={true}
            draggable={true}
            showDots={true}
            infinite={true}
            partialVisible={false}>
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
                    <h3 className="text-lg font-semibold text-purple-700">
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
                  <h2 className="text-2xl font-bold text-purple-700 ">
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
                    partialVisible={false}>
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
                            className="text-purple-800">
                            <h4 className="text-lg font-medium whitespace-nowrap overflow-ellipsis overflow-hidden text-purple-800">
                              {product.product_name}
                            </h4>
                          </Link>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-gray-600">$ {product.price}</p>

                            <button
                              onClick={() => {
                                dispatch(addToCart(product));
                              }}
                              className="rounded-lg bg-purple-700 px-3 py-2 text-white hover:bg-purple-800">
                              <MdOutlineShoppingCart />
                            </button>
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
