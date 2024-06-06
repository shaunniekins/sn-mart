"use client";

import Link from "next/link";
import Image from "next/image";
import { MdOutlinePerson2, MdOutlineShoppingCart } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "@/utils/redux/store";
import { useAppDispatch } from "@/utils/redux/hooks";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "@/utils/redux/features/products/cartReducer";
import { getUser } from "@/utils/functions/userFetch";
import { signOutCustomer } from "@/utils/functions/signOut";
import { removeSelectedStore } from "@/utils/redux/features/store/storeReducer";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import {
  editStoreInventoryData,
  fetchSpecificProductInStoreInventoryData,
} from "@/app/api/inventoryData";

const HeaderComponent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
      setIsCartOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const products = useSelector((state: RootState) => state.cart.items);
  const store = useSelector((state: RootState) => state.store);

  // redux
  const dispatch = useAppDispatch();

  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user && user?.user_metadata?.role?.includes("customer")) {
        setUser(user);
        setFirstName(user?.user_metadata.first_name);
        setLastName(user?.user_metadata.last_name);
        setIsLoggedIn(true);
        return;
      }

      setUser(null);
      setFirstName(null);
      setLastName(null);
      setIsLoggedIn(false);
    };

    fetchUser();
  }, [isLoggedIn]);

  const handleCheckout = async () => {
    for (const productId in products) {
      const product = products[productId];
      try {
        const inventoryData = await fetchSpecificProductInStoreInventoryData(
          product.product.store_id,
          product.product.product_id
        );
        if (inventoryData && inventoryData[0]) {
          const currentQuantity = inventoryData[0].quantity;
          const updatedQuantity = currentQuantity - product.quantity;
          const updatedInventory = { quantity: updatedQuantity };
          await editStoreInventoryData(
            product.product.store_id,
            product.product.product_id,
            updatedInventory
          );
        }
      } catch (error) {
        console.error(
          "Error updating inventory for product:",
          productId,
          error
        );
      }
    }
    dispatch(clearCart());
    onClose();
  };
  // console.log("products", products);
  // console.log("user", user);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (isOpen) {
      setIsCartOpen(false);
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpen}
        onClose={onClose}
        isDismissable={false}>
        <ModalContent>
          <ModalHeader className="text-xl font-bold text-main-theme">
            Confirm Checkout
          </ModalHeader>
          <ModalBody>
            <h1>Are you sure you want to proceed with the checkout?</h1>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="secondary" onPress={handleCheckout}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <header className="w-full bg-main-theme text-white p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex justify-center items-center gap-5">
            <Link href="\home" className="flex items-center text-2xl font-bold">
              <Image
                src="/images/sn-mart-logo.svg"
                alt="SN Mart Logo"
                width={45}
                height={45}
                className="rounded-full"
              />
              <span className="ml-2">SN Mart</span>
            </Link>
            {store.selectedStore?.store_name && (
              <button
                className="text-sm text-white"
                onClick={() => dispatch(removeSelectedStore())}>
                {store.selectedStore?.store_name}
              </button>
            )}
          </div>
          <div className="flex-grow mx-4 lg:mr-64 lg:ml-44 hidden md:block">
            <input
              type="search"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 text-black active:border-purple-700 focus:outline-none"
            />
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                {user ? (
                  <button
                    className="hover:text-hover-gray-theme"
                    onClick={async () => {
                      await signOutCustomer();
                      setIsLoggedIn(false);
                    }}>
                    <div className="flex gap-1 items-center">
                      <MdOutlinePerson2 className="text-xl" />
                      <h6 className="hidden md:block">
                        {firstName} {lastName}
                      </h6>
                    </div>
                  </button>
                ) : (
                  <Link href="/signin" className="hover:text-hover-gray-theme">
                    <div className="flex gap-1 items-center">
                      <MdOutlinePerson2 className="text-xl" />
                      <h6 className="hidden md:block">Account</h6>
                    </div>
                  </Link>
                )}
              </li>
              <li>
                <button
                  onClick={handleCartClick}
                  className="flex gap-1 items-center hover:text-hover-gray-theme">
                  <MdOutlineShoppingCart className="text-xl" />
                  <h6 className="hidden md:block">Cart</h6>
                </button>
              </li>
              {/* <li>
              {user ? (
                <button
                  onClick={handleCartClick}
                  className="flex gap-1 items-center hover:text-hover-gray-theme">
                  <MdOutlineShoppingCart className="text-xl" />
                  <h6 className="hidden md:block">Cart</h6>
                </button>
              ) : (
                <Link href="/signin" className="hover:text-hover-gray-theme">
                  <div className="flex gap-1 items-center">
                    <MdOutlineShoppingCart className="text-xl" />
                    <h6 className="hidden md:block">Cart</h6>
                  </div>
                </Link>
              )}
            </li> */}
            </ul>
          </nav>
        </div>
        {isCartOpen && (
          <div
            ref={cartRef}
            className="fixed right-0 top-0 h-full w-96 z-50 bg-white shadow-lg transition-all duration-300 flex flex-col">
            <div className="p-5">
              <div className="flex justify-between items-center ">
                <h2 className="text-lg font-bold text-main-theme">Cart</h2>
                <button
                  onClick={handleCartClick}
                  className="text-main-theme hover:text-hover-gray-theme">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <hr />
            <div className="pt-4 px-5 flex-grow text-black">
              {Object.entries(products).map(([productId, productDetails]) => {
                return (
                  <div key={productId}>
                    <div className="flex justify-between">
                      <div className="flex gap-x-3 mb-7">
                        <Image
                          src="/images/sn-mart-logo.svg"
                          alt="SN Mart Logo"
                          width={55}
                          height={55}
                          className="rounded-full"
                        />
                        <div className="flex flex-col text-sm">
                          <div className="flex justify-between">
                            <h2 className="text-main-theme">
                              {productDetails.product.product_name}
                            </h2>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    productId: Number(productId),
                                    quantity: productDetails.quantity + 1,
                                  })
                                )
                              }
                              className="text-gray-500 hover:text-hover-gray-theme">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="h-4 w-4">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </button>
                            <h3>{productDetails.quantity}</h3>
                            <button
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    productId: Number(productId),
                                    quantity: productDetails.quantity - 1,
                                  })
                                )
                              }
                              className="text-gray-500 hover:text-hover-gray-theme">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="h-4 w-4">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M18 12H6"
                                />
                              </svg>
                            </button>
                          </div>

                          <h3 className="mt-3 font-semibold">
                            ${productDetails.product.price}
                          </h3>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          dispatch(removeFromCart(Number(productId)))
                        }
                        className="text-gray-500 hover:text-hover-gray-theme">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-4 w-4">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <hr />
            <div className="p-5 w-full">
              <Button
                color={
                  products && Object.keys(products).length > 0
                    ? "secondary"
                    : "default"
                }
                isDisabled={products && Object.keys(products).length === 0}
                fullWidth
                onPress={onOpen}>
                Checkout
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default HeaderComponent;
