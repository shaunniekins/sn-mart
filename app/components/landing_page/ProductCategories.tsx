// ProductCategories.tsx

"use client";

import Link from "next/link";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { faker } from "@faker-js/faker";
import { MdOutlineShoppingCart } from "react-icons/md";
import React, { useCallback, useEffect, useState } from "react";
import { fetchDashboardData } from "@/app/api/brandsData";
import { fetchViewProductsDetailsData } from "@/app/api/productsData";
import { categories } from "@/app/data/categories";
import {
  responsiveCategories,
  responsiveProducts,
} from "@/app/utils/carouselFunctions";

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

  return (
    <section className="py-10 px-4">
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
                          <h4 className="text-lg font-medium text-gray-800 whitespace-nowrap overflow-ellipsis overflow-hidden">
                            {product.product_name}
                          </h4>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-gray-600">₱{100.0}</p>

                            <button className="rounded-lg bg-purple-700 px-3 py-2 text-white hover:bg-purple-800">
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
