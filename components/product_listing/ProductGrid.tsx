"use client";

import { fetchViewProductsDetailsData } from "@/api/productsData";
import { convertUrlFriendlyCategory } from "@/utils/conversion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";
import Carousel from "react-multi-carousel";

type Props = {
  productCategory: string;
};

const ProductGrid = ({ productCategory }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchViewProductsDetailsData(productCategory);
      if (data !== null) {
        setProducts(data);
        // console.log("data: ", data);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [productCategory]);

  const convertedCategory = convertUrlFriendlyCategory(productCategory);

  return (
    <section className="py-10 px-4">
      {isLoading ? (
        <div className="container mx-auto text-center h-full flex items-center justify-center">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="container mx-auto p-4">
          <div className="flex items-center text-sm">
            <Link href="/" className="text-purple-800">
              <h4>Home</h4>
            </Link>
            <span>
              <h3>&nbsp;/&nbsp;</h3>
            </span>
            <h3>{convertedCategory}</h3>
          </div>
          <h1 className="text-purple-800 text-2xl font-bold my-5">
            {convertedCategory}
          </h1>
          <div className="grid grid-cols-4 md:grid-cols-5 gap-4 ">
            {products.map((product) => (
              <div
                key={product.product_name}
                className="sliderProducts bg-white rounded-lg shadow-md p-4">
                <img
                  src={"/images/sn-mart-logo.jpeg"}
                  alt={product.product_name}
                  className="w-full h-40 object-cover mb-2"
                />
                <Link
                  href={`/products/${productCategory}/${product.product_id}`}
                  className="text-purple-800">
                  <h4 className="text-lg font-medium whitespace-nowrap overflow-ellipsis overflow-hidden text-purple-800">
                    {product.product_name}
                  </h4>
                </Link>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-600">₱{100.0}</p>

                  <button className="rounded-lg bg-purple-700 px-3 py-2 text-white hover:bg-purple-800">
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
