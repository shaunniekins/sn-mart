import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MdOutlineShoppingCart } from "react-icons/md";
import { addToCart } from "@/utils/redux/features/products/cartReducer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { getUser } from "@/utils/functions/userFetch";

interface AddToCartButtonProps {
  product: any;
  isDisabled?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  isDisabled,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = await getUser();
      setIsAuthenticated(
        user && user?.user_metadata?.role?.includes("customer")
      );
    };

    checkUser();
  }, []);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    dispatch(addToCart(product));
    toast.success(`${product.product_name} added to cart!`, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: "z-[2000]",
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`${
        isDisabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-main-theme hover:bg-main-hover-theme"
      } rounded-lg px-3 py-2 text-white `}
    >
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
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = await getUser();
      setIsAuthenticated(
        user && user?.user_metadata?.role?.includes("customer")
      );
    };

    checkUser();
  }, []);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    dispatch(addToCart(product));
    toast.success(`${product.product_name} added to cart!`, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: "z-[2000]",
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`${
        isDisabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-main-theme hover:bg-main-hover-theme"
      } mt-10 mb-12 rounded-full px-14 py-4 text-white flex items-center gap-2`}
    >
      <MdOutlineShoppingCart />
      <p>{isDisabled ? "Out of stock" : "Add to cart product "}</p>
    </button>
  );
};
