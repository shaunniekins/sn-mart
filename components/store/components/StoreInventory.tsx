"use client";

import { fetchAllBrandsData } from "@/app/api/brandsData";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

type Inventory = {
  inventory_id: number;
  product_name: string;
  quantity: number;
  price: number;
  brand: string;
};

function StoreInventory() {
  const [storeInventory, setStoreInventory] = useState<Inventory[]>([]);

  // fetching
  const [searchValue, setSearchValue] = useState("");
  const entriesPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [numOfEntries, setNumOfEntries] = useState(1);
  const [loadingState, setLoadingState] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const totalPages = Math.ceil(numOfEntries / entriesPerPage);

  const fetchStoreInventory = async () => {
    try {
      setLoadingState("loading");
      //   const response = await fetchAllInventoryData(
      //     searchValue,
      //     entriesPerPage,
      //     currentPage
      //   );
      //   if (response?.error) {
      //     console.error(response.error);
      //     setLoadingState("error");
      //   } else {
      //     setStoreInventory(response.data as Inventory[]);
      //     setNumOfEntries(response.count || 1);
      //     setLoadingState("idle");
      //   }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoadingState("error");
    }
  };

  useEffect(() => {
    fetchStoreInventory();
  }, [searchValue, entriesPerPage, currentPage]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  //   const [inputBrandName, setInputBrandName] = useState("");

  //   const [editingBrand, setEditingBrand] = useState<Inventory | null>(null);

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold mb-2">Store Inventory</h3>
        <div className="flex items-center gap-2">
          <Button
            radius="md"
            className="bg-main-theme hover:bg-main-hover-theme text-white"
            onPress={onOpen}>
            + Add
          </Button>
          <Input
            isClearable
            onClear={() => setSearchValue("")}
            radius="lg"
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focused=true]:bg-default-200/50",
                "dark:group-data-[focused=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            placeholder="Type to search..."
            value={searchValue}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchValue(e.target.value);
            }}
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
          />
        </div>
      </div>
    </>
  );
}

export default StoreInventory;
