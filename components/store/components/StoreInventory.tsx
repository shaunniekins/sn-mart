"use client";

import {
  deleteStoreInventoryData,
  editStoreInventoryData,
  fetchCheckedProductInStoreInventoryData,
  fetchStoreInventoryData,
  insertStoreInventoryData,
} from "@/app/api/inventoryData";
import { fetchAllProductsData } from "@/app/api/productsData";
import { SearchIcon } from "@/components/icons/SearchIcon";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import ProductCheckbox from "./ProductCheckbox";
import { current } from "@reduxjs/toolkit";

type Inventory = {
  inventory_id: number;
  store_id: number;
  store_name: string;
  store_location: string;
  store_operating_hours: string;
  product_id: number;
  product_name: string;
  upc_code: string;
  size: string;
  brand_name: string;
  product_type_name: string;
  price: number;
  quantity: number;
};

type StoreInventoryProps = {
  storeId: number;
};

const StoreInventory: React.FC<StoreInventoryProps> = ({ storeId }) => {
  const [storeInventory, setStoreInventory] = useState<Inventory[]>([]);

  // fetching
  const entriesPerPage = 10;
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [numOfEntries, setNumOfEntries] = useState(1);
  const [loadingState, setLoadingState] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const totalPages = Math.ceil(numOfEntries / entriesPerPage);

  // fetching for modal
  const [modalSearchValue, setModalSearchValue] = useState("");
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [modalNumOfEntries, setModalNumOfEntries] = useState(1);
  const [modalLoadingState, setModalLoadingState] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const modalTotalPages = Math.ceil(modalNumOfEntries / entriesPerPage);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchStoreInventory = async () => {
    try {
      setLoadingState("loading");
      const response = await fetchStoreInventoryData(
        storeId,
        searchValue,
        entriesPerPage,
        currentPage
      );
      if (response?.error) {
        console.error(response.error);
        setLoadingState("error");
      } else {
        setStoreInventory(response.data as Inventory[]);
        setNumOfEntries(response.count || 1);
        setLoadingState("idle");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoadingState("error");
    }
  };

  useEffect(() => {
    fetchStoreInventory();
  }, [storeId, searchValue, entriesPerPage, currentPage]);

  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      setModalLoadingState("loading");
      const response = await fetchAllProductsData(
        modalSearchValue,
        entriesPerPage,
        modalCurrentPage
      );
      if (response?.error) {
        console.error(response.error);
        setModalLoadingState("error");
      } else {
        setProducts(response.data as Product[]);
        setModalNumOfEntries(response.count || 1);
        setModalLoadingState("idle");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setModalLoadingState("error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [modalSearchValue, entriesPerPage, modalCurrentPage]);

  // const [includedProducts, setIncludedProducts] = useState<any[]>([]);

  const [initialCheckboxState, setInitialCheckboxState] = useState<
    Record<number, boolean>
  >({});
  const [currentCheckboxState, setCurrentCheckboxState] = useState<
    Record<number, boolean>
  >({});
  // const [quantityInputs, setQuantityInputs] = useState<Record<number, number>>(
  //   {}
  // );

  // fetch products that are in store inventory
  // use to filter products
  const fetchIncludedProductsInventory = async () => {
    try {
      const response = await fetchCheckedProductInStoreInventoryData(
        storeId,
        modalSearchValue,
        entriesPerPage,
        modalCurrentPage
      );
      if (response) {
        // setIncludedProducts(response);
        setInitialCheckboxState(
          response.reduce(
            (acc, productId) => ({ ...acc, [productId]: true }),
            {}
          )
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    setCurrentCheckboxState({ ...initialCheckboxState });
  }, [initialCheckboxState]);

  useEffect(() => {
    fetchIncludedProductsInventory();
  }, [storeId, searchValue, entriesPerPage, currentPage]);

  //   const [inputBrandName, setInputBrandName] = useState("");

  //   const [editingBrand, setEditingBrand] = useState<Inventory | null>(null);

  const [currentSelectedButton, setCurrentSelectedButton] = useState("close");

  const handleManageStoreInventory = async () => {
    onClose();

    for (const product of products) {
      if (
        initialCheckboxState[product.product_id] &&
        !currentCheckboxState[product.product_id]
      ) {
        await deleteStoreInventoryData(storeId, product.product_id);
      } else if (
        !initialCheckboxState[product.product_id] &&
        currentCheckboxState[product.product_id]
      ) {
        await insertStoreInventoryData({
          store_id: storeId,
          product_id: product.product_id,
        });
      }
    }
    fetchStoreInventory();
    fetchIncludedProductsInventory();
  };

  useEffect(() => {
    if (!isOpen) {
      handleRemoveInputValues();
    }
  }, [isOpen, currentSelectedButton]);

  const handleRemoveInputValues = () => {
    setModalCurrentPage(1);
    setModalSearchValue("");

    // // Reset the checkbox state to its initial state
    // setCurrentCheckboxState({ ...initialCheckboxState });
    // fetchIncludedProductsInventory();
  };

  const columns = [
    { key: "product_name", label: "Product Name" },
    { key: "upc_code", label: "UPC Code" },
    { key: "size", label: "Size" },
    { key: "price", label: "Price" },
    { key: "brand_name", label: "Brand" },
    { key: "product_type_name", label: "Category" },
    { key: "quantity", label: "Quantity" },
  ];

  const columnInModal = [
    { key: "product_name", label: "Product Name" },
    { key: "upc_code", label: "UPC Code" },
    { key: "size", label: "Size" },
    { key: "price", label: "Price" },
    { key: "brand_name", label: "Brand" },
    { key: "product_type_name", label: "Category" },
    { key: "action", label: "Action" },
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpen}
        onClose={onClose}
        isDismissable={false}
        size="full">
        <ModalContent>
          <ModalHeader className="text-xl font-bold text-main-theme">
            Manage Store Inventory
          </ModalHeader>
          <ModalBody>
            <Input
              isClearable
              onClear={() => setModalSearchValue("")}
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
              value={modalSearchValue}
              onChange={(e) => {
                setModalCurrentPage(1);
                setModalSearchValue(e.target.value);
              }}
              startContent={
                <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
              }
            />
            <Table
              aria-label="Manage Store Inventory"
              key="manage-store-inventory-table"
              bottomContent={
                modalTotalPages > 0 ? (
                  <div className="flex w-full justify-center">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="secondary"
                      page={modalCurrentPage}
                      total={modalTotalPages}
                      onChange={(page) => setModalCurrentPage(page)}
                      className="bg-"
                    />
                  </div>
                ) : null
              }>
              <TableHeader columns={columnInModal}>
                {(column) => (
                  <TableColumn
                    key={column.key}
                    className="bg-main-theme text-white text-center">
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                items={products}
                emptyContent={"No rows to display."}
                loadingContent={<Spinner color="secondary" />}
                loadingState={modalLoadingState}>
                {(product: Product) => (
                  <TableRow
                    key={`product-${product.product_id}`}
                    className="text-center">
                    {columnInModal.map((columnKey, columnIndex) => {
                      if (columnIndex === columnInModal.length - 1) {
                        return (
                          <TableCell
                            key={`${product.product_id}-${columnKey.key}`}>
                            <ProductCheckbox
                              productId={product.product_id}
                              currentCheckboxState={currentCheckboxState}
                              setCurrentCheckboxState={setCurrentCheckboxState}
                            />
                          </TableCell>
                        );
                      }

                      if (columnKey.key === "price") {
                        return (
                          <TableCell
                            key={`${product.product_id}-${columnKey.key}`}>
                            ${product[columnKey.key].toFixed(2)}
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell
                          key={`${product.product_id}-${columnKey.key}`}>
                          {product[columnKey.key as keyof typeof product]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onClick={() => {
                const hasChanges = Object.keys(currentCheckboxState).some(
                  (key) =>
                    currentCheckboxState[key as any] !==
                    initialCheckboxState[key as any]
                );

                if (hasChanges && currentSelectedButton !== "done") {
                  const confirmLeave = window.confirm(
                    "You have unsaved changes. Are you sure you want to leave?"
                  );
                  if (!confirmLeave) {
                    return;
                  }
                }
                fetchIncludedProductsInventory();
                setCurrentSelectedButton("cancel");
                onClose();
              }}>
              Close
            </Button>
            <Button
              color="primary"
              onClick={() => {
                setCurrentSelectedButton("done");
                handleManageStoreInventory();
              }}
              className={`bg-main-theme text-white 
       hover:bg-main-hover-theme`}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold mb-2">Store Inventory</h3>
          <div className="flex items-center gap-2">
            <Button
              radius="md"
              className="bg-main-theme hover:bg-main-hover-theme text-white"
              onPress={onOpen}>
              Manage
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
        <Table
          aria-label="Store Inventory Table"
          key="store-inventory-table"
          bottomContent={
            totalPages > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={currentPage}
                  total={totalPages}
                  onChange={(page) => setCurrentPage(page)}
                  className="bg-"
                />
              </div>
            ) : null
          }>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                className="bg-main-theme text-white text-center">
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={storeInventory}
            emptyContent={"No rows to display."}
            loadingContent={<Spinner color="secondary" />}
            loadingState={loadingState}>
            {(inventory) => (
              <TableRow key={inventory.product_id} className="text-center">
                {(columnKey) => {
                  if (columnKey === "price") {
                    return <TableCell>${inventory.price}</TableCell>;
                  }
                  if (columnKey === "quantity") {
                    return (
                      <TableCell>
                        <Button
                          isDisabled
                          color={
                            inventory.quantity === 0
                              ? "danger"
                              : inventory.quantity < 10
                              ? "warning"
                              : "secondary"
                          }>
                          {inventory.quantity}
                        </Button>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell>
                      {inventory[columnKey as keyof typeof inventory]}
                    </TableCell>
                  );
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default StoreInventory;
