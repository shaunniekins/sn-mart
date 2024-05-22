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
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  input,
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
import ProductCheckbox from "./ProductCheckbox";
import { current } from "@reduxjs/toolkit";
import { createClient } from "@/utils/supabase/client";
import {
  editStockRequestData,
  editStockRequestDataByProductId,
  fetchStockRequestData,
  insertStockRequestData,
} from "@/app/api/stockRequestData";
import { fetchAllVendorsData } from "@/app/api/vendorsData";

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
  status: string;
};

type Vendor = {
  vendor_id: number;
  vendor_name: string;
  vendor_location: string;
  vendor_manager_id: string;
};

type StoreInventoryProps = {
  storeId: number;
};

const StoreInventory: React.FC<StoreInventoryProps> = ({ storeId }) => {
  const supabase = createClient();

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

  // for modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalSearchValue, setModalSearchValue] = useState("");
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [modalNumOfEntries, setModalNumOfEntries] = useState(1);
  const [modalLoadingState, setModalLoadingState] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const modalTotalPages = Math.ceil(modalNumOfEntries / entriesPerPage);

  const [products, setProducts] = useState<Product[]>([]);

  const [initialCheckboxState, setInitialCheckboxState] = useState<
    Record<number, boolean>
  >({});
  const [currentCheckboxState, setCurrentCheckboxState] = useState<
    Record<number, boolean>
  >({});

  const [currentSelectedButton, setCurrentSelectedButton] = useState("close");

  // stocks of the inventory
  // const [stockRequestData, setStockRequestData] = useState(null);
  const {
    isOpen: isRestockOpen,
    onOpen: openRestock,
    onClose: closeRestock,
  } = useDisclosure();

  // const [stockRequests, setStockRequests] = useState<Record<number, any>>({});

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

        // const stockRequests: { [key: number]: any } = {};
        // for (const item of response.data) {
        //   const stockResponse = await fetchStockRequestData(
        //     storeId,
        //     item.product_id
        //   );
        //   stockRequests[item.product_id] = stockResponse;
        // }
        // setStockRequests(stockRequests);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoadingState("error");
    }
  };

  useEffect(() => {
    fetchStoreInventory();

    const channel = supabase
      .channel(`realtime inventory store_id=eq.${storeId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Inventory",
          filter: "store_id=eq." + storeId,
        },
        (payload) => {
          if (payload.new) {
            fetchStoreInventory();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [storeId, searchValue, entriesPerPage, currentPage]);

  // Modify fetchData function to compare product details
  const fetchData = async () => {
    try {
      setModalLoadingState("loading");

      // Fetch products
      const productsResponse = await fetchAllProductsData(
        modalSearchValue,
        entriesPerPage,
        modalCurrentPage
      );
      if (productsResponse?.error) {
        console.error(productsResponse.error);
        setModalLoadingState("error");
        return;
      }

      // Extract productIds from productsResponse
      const productIds = productsResponse.data.map(
        (product) => product.product_id
      );

      // Fetch included products inventory
      const inventoryResponse = await fetchCheckedProductInStoreInventoryData(
        storeId,
        productIds
      );

      // Process response
      setProducts(productsResponse.data as Product[]);
      setModalNumOfEntries(productsResponse.count || 1);
      setModalLoadingState("idle");

      if (inventoryResponse) {
        // Extract product IDs from inventory response
        const includedProductIds = inventoryResponse.map(
          (product) => product.product_id
        );

        // Update checkbox state based on included product IDs
        const initialCheckboxState: Record<number, boolean> = {};
        includedProductIds.forEach((productId) => {
          initialCheckboxState[productId] = true;
        });

        setInitialCheckboxState(initialCheckboxState);
        setCurrentCheckboxState(initialCheckboxState);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setModalLoadingState("error");
    }
  };

  useEffect(() => {
    fetchData();
  }, [storeId, modalSearchValue, entriesPerPage, modalCurrentPage]);

  useEffect(() => {
    fetchData();
  }, [storeId, modalSearchValue, entriesPerPage, modalCurrentPage]);

  // modal manage store inventory (add or remove)
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
    // fetchProducts();
    // fetchIncludedProductsInventory();
    fetchData();
  };

  useEffect(() => {
    if (!isOpen) {
      handleRemoveInputValues();
    }
  }, [isOpen, currentSelectedButton]);

  const handleRemoveInputValues = () => {
    setModalCurrentPage(1);
    setModalSearchValue("");
  };

  const columns = [
    { key: "product_name", label: "Product Name" },
    { key: "upc_code", label: "UPC Code" },
    { key: "size", label: "Size" },
    { key: "price", label: "Price" },
    { key: "brand_name", label: "Brand" },
    { key: "product_type_name", label: "Category" },
    { key: "quantity", label: "Quantity" },
    { key: "action", label: "Action" },
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

  useEffect(() => {
    if (!isRestockOpen) {
      handleRemoveInputValuesStock();
    }
  }, [isRestockOpen]);

  const handleRemoveInputValuesStock = () => {
    setInputQty(null);
    setCurrentProductId(null);
    setSelectedVendorId(null);
    setSelectedVendorName("");
  };

  const [requestNewStock, setRequestNewStock] = useState(true);
  const [inputQty, setInputQty] = useState<number | null>(null);

  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);
  const [selectedVendorName, setSelectedVendorName] = useState<string>("");

  const [currentProductId, setCurrentProductId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDefaultData = async () => {
      if (currentProductId) {
        const requestedQuantityArray = await fetchStockRequestData(
          storeId,
          currentProductId
        );
        if (requestedQuantityArray && requestedQuantityArray.length > 0) {
          const requestedQuantity =
            requestedQuantityArray[0].requested_quantity;
          const currentVendorId = requestedQuantityArray[0].vendor_id;
          const currentVendorName = requestedQuantityArray[0].vendor_name;
          setInputQty(requestedQuantity);
          setSelectedVendorId(currentVendorId);
          setSelectedVendorName(currentVendorName);
        }
      }
    };

    fetchDefaultData();
  }, [currentProductId]);

  // temporary implementation of vendor/retailer
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const fetchVendors = async () => {
    try {
      const response = await fetchAllVendorsData();
      if (response === null) {
        console.error("An error occurred:", response);
      } else {
        setVendors(response as Vendor[]);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleAddOrEditRestock = async () => {
    if (requestNewStock) {
      await insertStockRequestData({
        store_id: storeId,
        product_id: Number(currentProductId),
        requested_quantity: Number(inputQty),
        vendor_id: Number(selectedVendorId),
      });
    } else {
      await editStockRequestDataByProductId(Number(currentProductId), {
        requested_quantity: Number(inputQty),
        vendor_id: Number(selectedVendorId),
      });
    }

    fetchStoreInventory();
    closeRestock();
  };

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
                              key={product.product_id}
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
                fetchData();
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
      <Modal
        isOpen={isRestockOpen}
        onOpenChange={openRestock}
        onClose={closeRestock}
        isDismissable={false}
        // size="full"
      >
        <ModalContent>
          <ModalHeader className="text-xl font-bold text-main-theme">
            {!requestNewStock ? "Edit Restock Request" : "Request New Stock"}
          </ModalHeader>
          <ModalBody>
            <div className="grid w-full gap-3">
              <div className="form-container">
                <label htmlFor="inputQty" className="form-label">
                  Quantity
                </label>
                <Input
                  type="number"
                  id="inputQty"
                  name="inputQty"
                  placeholder="Quantity"
                  value={inputQty !== null ? inputQty.toString() : ""}
                  onChange={(e) => setInputQty(Number(e.target.value))}
                />
              </div>
              <div className="form-container">
                <label htmlFor="inputQty" className="form-label">
                  Vendor
                </label>
                <Autocomplete
                  label="Select a supplier"
                  id="supplier"
                  placeholder={selectedVendorName}
                  onInputChange={(value) => {
                    const selectedVendor = vendors.find(
                      (vendor) => vendor.vendor_name.toString() === value
                    );
                    if (selectedVendor) {
                      setSelectedVendorId(selectedVendor.vendor_id);
                    }
                  }}>
                  {vendors.map((vendor) => (
                    <AutocompleteItem
                      key={vendor.vendor_id}
                      value={vendor.vendor_id.toString()}>
                      {vendor.vendor_name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={closeRestock}>
              Close
            </Button>
            <Button
              color="primary"
              onPress={handleAddOrEditRestock}
              disabled={!inputQty || inputQty < 50 || !selectedVendorId}
              className={`bg-main-theme text-white ${
                !inputQty || inputQty < 50 || !selectedVendorId
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-main-hover-theme"
              }`}>
              {!requestNewStock ? "Edit Restock" : "Request Stock"}
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
                  if (columnKey === "action") {
                    return (
                      <TableCell>
                        <Button
                          color={
                            inventory.status === "Pending" && inventory
                              ? "warning"
                              : "secondary"
                          }
                          variant="ghost"
                          onClick={() => {
                            setCurrentProductId(inventory.product_id);

                            if (inventory.status === "Pending") {
                              setRequestNewStock(false);
                            } else {
                              setRequestNewStock(true);
                            }
                          }}
                          onPress={openRestock}>
                          {inventory.status === "Pending"
                            ? "Pending"
                            : "Restock"}
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
