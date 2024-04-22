"use client";

import { fetchSpecificProductDetailsData } from "@/src/api/productsData";
import { addToCart } from "@/src/redux/features/products/cartReducer";
import { useAppDispatch } from "@/src/redux/hooks";
import { convertUrlFriendlyCategory } from "@/src/utils/conversion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";

type Props = {
  productId: string;
  productCategory: string;
};

const ProductDetails = ({ productId, productCategory }: Props) => {
  const [product, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSpecificProductDetailsData(parseInt(productId));
      if (data !== null) {
        setProduct(data[0]);
        // console.log("data ", data);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [productId]);

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
          <div className="flex items-center text-sm">
            <Link href="/" className="text-purple-800">
              <h4>Home</h4>
            </Link>
            <span>
              <h3>&nbsp;/&nbsp;</h3>
            </span>
            <Link
              href={`/products/${productCategory}`}
              className="text-purple-800">
              <h3>{convertedCategory}&nbsp;</h3>
            </Link>
            <span>
              <h3>&nbsp;/&nbsp;</h3>
            </span>
            <h3>{product?.product_name}</h3>
          </div>
          {/* <h1 className="text-purple-800 text-2xl font-bold my-5">
            {product?.product_name}
          </h1> */}
          <div className="product-details-container">
            <div className="flex justify-center items-center">
              <Image
                src="/images/sn-mart-logo.svg"
                width={30}
                height={30}
                alt="SN Mart Logo"
                style={{ width: "60%" }}
              />
            </div>
            <div>
              <h1 className="text-purple-800 text-4xl font-bold mb-3">
                {product?.product_name}
              </h1>
              <h3 className="text-xl">{product?.brand_name}</h3>
              <p>${product?.price}</p>

              <button
                onClick={() => {
                  if (product) {
                    dispatch(addToCart(product));
                  }
                }}
                className="mt-10 mb-12 rounded-full bg-purple-700 px-14 py-4 text-white hover:bg-purple-800 flex items-center gap-2">
                <MdOutlineShoppingCart />
                <p>Add to cart product</p>
              </button>

              <h4 className="text-xl mb-3">Description</h4>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Pariatur, corporis deserunt, magni esse dolor optio vitae non
                officiis animi veritatis quisquam tenetur molestias assumenda
                reiciendis facere, nobis vero in doloribus.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetails;
