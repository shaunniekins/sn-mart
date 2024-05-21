import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { MdAdd, MdClear } from "react-icons/md";

type ProductCheckboxProps = {
  productId: number;
  currentCheckboxState: Record<number, boolean>;
  setCurrentCheckboxState: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >;
};

const ProductCheckbox: React.FC<ProductCheckboxProps> = ({
  productId,
  currentCheckboxState,
  setCurrentCheckboxState,
}) => {
  const isChecked = currentCheckboxState[productId] || false;

  const handlePress = () => {
    const newState = !isChecked;
    setCurrentCheckboxState((prevState) => ({
      ...prevState,
      [productId]: newState,
    }));
  };

  return (
    <Button
      isIconOnly
      key={`${productId}-${isChecked}`}
      radius="md"
      color={isChecked ? "warning" : "secondary"}
      onPress={handlePress}>
      <span className="transition duration-300">
        {isChecked ? <MdClear /> : <MdAdd />}
      </span>
    </Button>
  );
};

export default ProductCheckbox;
