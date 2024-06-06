import React from "react";
import { useDispatch } from "react-redux";
import { MdOutlineShoppingCart } from "react-icons/md";
import { addToCart } from "@/utils/redux/features/products/cartReducer";

interface AddToCartButtonProps {
  product: any;
  isDisabled?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  isDisabled,
}) => {
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => {
        dispatch(addToCart(product));
      }}
      disabled={isDisabled}
      className={`${
        isDisabled ? "bg-gray-400" : "bg-main-theme hover:bg-main-hover-theme"
      } rounded-lg px-3 py-2 text-white `}>
      <MdOutlineShoppingCart />
    </button>
  );
};

export default AddToCartButton;

export const AddToCartButtonAlt: React.FC<AddToCartButtonProps> = ({
  product,
  isDisabled,
}) => {
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => {
        dispatch(addToCart(product));
      }}
      disabled={isDisabled}
      className={`${
        isDisabled ? "bg-gray-400" : "bg-main-theme hover:bg-main-hover-theme"
      } mt-10 mb-12 rounded-full px-14 py-4 text-white flex items-center gap-2`}>
      <MdOutlineShoppingCart />
      <p>{isDisabled ? "Out of stock" : "Add to cart product "}</p>
    </button>
  );
};
