// ProductCategories.tsx

"use client";

import Link from "next/link";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { faker } from "@faker-js/faker";
import { MdOutlineShoppingCart } from "react-icons/md";

const ProductCategories = () => {
  const categories = [
    {
      name: "Electronics",
      image: "/images/sn-mart-logo.jpeg",
      link: "/products?category=electronics",
    },
    {
      name: "Clothing",
      image: "/images/sn-mart-logo.jpeg",
      link: "/products?category=clothing",
    },
    {
      name: "Home & Kitchen",
      image: "/images/sn-mart-logo.jpeg",
      link: "/products?category=home-kitchen",
    },
    {
      name: "Sports & Outdoors",
      image: "/images/sn-mart-logo.jpeg",
      link: "/products?category=sports-outdoors",
    },
    {
      name: "Beauty & Personal Care",
      image: "/images/sn-mart-logo.jpeg",
      link: "/products?category=beauty-personal-care",
    },
    {
      name: "Toys & Games",
      image: "/images/sn-mart-logo.jpeg",
      link: "/products?category=toys-games",
    },
    {
      name: "Books & Media",
      image: "/images/sn-mart-logo.jpeg",
      link: "/products?category=books-media",
    },
    {
      name: "Automotive",
      image: "/images/sn-mart-logo.jpeg",
      link: "/products?category=automotive",
    },
    {
      name: "Pet Supplies",
      image: "/images/sn-mart-logo.jpeg",
      link: "/products?category=pet-supplies",
    },
    {
      name: "Office & Stationery",
      image: "/images/sn-mart-logo.jpeg",
      link: "/products?category=office-stationery",
    },
  ];

  const productNamesByCategory: { [key: string]: string[] } = {
    Electronics: ["TV", "Laptop", "Smartphone", "Headphones", "Speaker"],
    Clothing: ["Shirt", "Pants", "Shoes", "Hat", "Jacket"],
    "Home & Kitchen": [
      "Cookware",
      "Utensils",
      "Furniture",
      "Appliances",
      "Decor",
    ],
    "Sports & Outdoors": [
      "Fitness Equipment",
      "Camping Gear",
      "Sporting Goods",
      "Outdoor Games",
      "Bicycles",
    ],
    "Beauty & Personal Care": [
      "Makeup",
      "Skincare",
      "Hair Care",
      "Fragrances",
      "Grooming Tools",
    ],
    "Toys & Games": [
      "Building Toys",
      "Puzzles",
      "Board Games",
      "Action Figures",
      "Dolls",
    ],
    "Books & Media": ["Books", "Movies", "Music", "Magazines", "Video Games"],
    Automotive: [
      "Tires",
      "Car Parts",
      "Tools",
      "Accessories",
      "Cleaning Supplies",
    ],
    "Pet Supplies": ["Food", "Toys", "Bedding", "Grooming", "Health Care"],
    "Office & Stationery": [
      "Pens",
      "Notebooks",
      "Organizers",
      "Printers",
      "Furniture",
    ],
  };

  const generateProducts = (categoryName: string) => {
    // const numProducts = Math.floor(Math.random() * 5) + 3; // 3 to 7 products
    const numProducts = Math.floor(Math.random() * 5) + 6;
    const products = [];
    for (let i = 0; i < numProducts; i++) {
      // const productNames = productNamesByCategory[categoryName];
      // const productName =
      //   productNames[Math.floor(Math.random() * productNames.length)];
      products.push({
        // name: productName,
        name: faker.commerce.productName(),
        // image: faker.image.imageUrl(200, 200, categoryName, true),
        image: "/images/sn-mart-logo.jpeg",
        price: faker.commerce.price(),
      });
    }
    return products;
  };

  const responsiveCategories = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
      slidesToSlide: 3,
    },
    mobile: {
      breakpoint: { max: 767, min: 464 },
      items: 2,
      slidesToSlide: 1,
    },
  };

  const responsiveProducts = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
      slidesToSlide: 6,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 5,
      slidesToSlide: 5,
    },
    mobile: {
      breakpoint: { max: 767, min: 464 },
      items: 4,
      slidesToSlide: 4,
    },
  };

  return (
    <section className="py-10 px-4">
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
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-purple-700 ">
                  {category.name}
                </h2>

                <Link href={category.link} key={category.name}>
                  <h3 className="text-sm text-gray-800 ">See More</h3>
                </Link>
              </div>
              <Carousel
                responsive={responsiveProducts}
                autoPlay={false}
                swipeable={true}
                draggable={true}
                showDots={false}
                infinite={true}
                partialVisible={false}>
                {generateProducts(category.name).map((product) => (
                  <div
                    key={product.name}
                    className="sliderProducts bg-white rounded-lg shadow-md p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover mb-2"
                    />
                    <h4 className="text-lg font-medium text-gray-800 whitespace-nowrap overflow-ellipsis overflow-hidden">
                      {product.name}
                    </h4>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-gray-600">₱{product.price}</p>

                      <button className="rounded-lg bg-purple-700 px-3 py-2 text-white hover:bg-purple-800">
                        <MdOutlineShoppingCart />
                      </button>
                    </div>
                  </div>
                ))}
              </Carousel>
              {/* <div className="mt-2 mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {generateProducts(category.name).map((product) => (
                  <div
                    key={product.name}
                    className="bg-white rounded-lg shadow-md p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover mb-2"
                    />
                    <h4 className="text-lg font-medium text-gray-800">
                      {product.name}
                    </h4>
                    <p className="text-gray-600">${product.price}</p>
                  </div>
                ))}
              </div> */}
            </>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
