"use client";

import { fetchSpecificProductDetailsData } from "@/app/api/productsData";
import { addToCart } from "@/utils/redux/features/products/cartReducer";
import { useAppDispatch } from "@/utils/redux/hooks";
import { convertUrlFriendlyCategory } from "@/utils/component_functions/conversion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";

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
          <Breadcrumbs>
            <BreadcrumbItem className="section-link">
              <Link href="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem className="section-link">
              <Link href={`/products/${productCategory}`}>
                {convertedCategory}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>{product?.product_name}</BreadcrumbItem>
          </Breadcrumbs>
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
              <h1 className="text-main-theme text-4xl font-bold mb-3">
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
                className="mt-10 mb-12 rounded-full bg-main-theme px-14 py-4 text-white hover:bg-main-hover-theme flex items-center gap-2">
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
