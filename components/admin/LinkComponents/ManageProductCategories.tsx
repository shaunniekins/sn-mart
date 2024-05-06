"use client";

import { useEffect, useState } from "react";

import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";

import {
  Breadcrumbs,
  BreadcrumbItem,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  useDisclosure,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import { SearchIcon } from "@/components/SearchIcon";

import Link from "next/link";
import {
  deleteProductTypeData,
  editProductTypeData,
  fetchAllProductTypesData,
  insertProductTypeData,
} from "@/app/api/productTypesData";

type ProductType = {
  product_type_id: number;
  product_type_name: string;
};

const ManageProductCategories = () => {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  // fetching
  const [searchValue, setSearchValue] = useState("");
  const entriesPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [numOfEntries, setNumOfEntries] = useState(1);
  const [loadingState, setLoadingState] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const totalPages = Math.ceil(numOfEntries / entriesPerPage);

  const fetchProductCategories = async () => {
    try {
      setLoadingState("loading");
      const response = await fetchAllProductTypesData(
        searchValue,
        entriesPerPage,
        currentPage
      );
      if (response?.error) {
        console.error(response.error);
        setLoadingState("error");
      } else {
        setProductTypes(response.data as ProductType[]);
        setNumOfEntries(response.count || 1);
        setLoadingState("idle");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoadingState("error");
    }
  };

  useEffect(() => {
    fetchProductCategories();
  }, [searchValue, entriesPerPage, currentPage]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [inputProductTypeName, setInputProductTypeName] = useState("");

  const [editingProductType, setEditingProductType] =
    useState<ProductType | null>(null);

  const handleAddOrEditProductType = async () => {
    try {
      if (editingProductType) {
        await editProductTypeData(
          editingProductType.product_type_id,
          inputProductTypeName
        );
      } else {
        await insertProductTypeData(inputProductTypeName);
      }

      fetchProductCategories();

      setInputProductTypeName("");
      setEditingProductType(null);
      onClose();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      handleRemoveInputValues();
    }
  }, [isOpen]);

  const handleRemoveInputValues = () => {
    setInputProductTypeName("");
    setEditingProductType(null);
  };

  const columns = [
    { key: "product_type_name", label: "Product Type Name" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpen}
        onClose={onClose}
        isDismissable={false}>
        <ModalContent>
          <ModalHeader className="text-xl font-bold text-main-theme">
            {editingProductType ? "Edit Product Type" : "Add Product Type"}
          </ModalHeader>
          <ModalBody>
            <div className="grid w-full gap-3">
              <div className="form-container">
                <label htmlFor="product_type_name" className="form-label">
                  Product Type Name
                </label>
                <Input
                  type="text"
                  id="product_type_name"
                  name="product_type_name"
                  placeholder="Product Type Name"
                  value={inputProductTypeName}
                  onChange={(e) => setInputProductTypeName(e.target.value)}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button
              color="primary"
              onPress={handleAddOrEditProductType}
              disabled={!inputProductTypeName}
              className={`bg-main-theme text-white ${
                !inputProductTypeName
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-main-hover-theme"
              }`}>
              {editingProductType ? "Edit Product Type" : "Add Product Type"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Breadcrumbs>
        <BreadcrumbItem className="section-link">
          <Link href="/admin/protected">Dashboard</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>Manage Product Types</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="section-title">Manage Product Types</h1>

      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold mb-2">Existing Product Types</h3>
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
        <Table
          aria-label="Product Type Table"
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
            items={productTypes}
            emptyContent={"No rows to display."}
            loadingContent={<Spinner color="secondary" />}
            loadingState={loadingState}>
            {(productType) => (
              <TableRow
                key={productType.product_type_id}
                className="text-center">
                {(columnKey) => {
                  if (columnKey === "actions") {
                    return (
                      <TableCell className="flex gap-2 justify-center">
                        <Button
                          isIconOnly
                          radius="sm"
                          onClick={() => {
                            setInputProductTypeName(
                              productType.product_type_name
                            );
                            setEditingProductType(productType);
                          }}
                          onPress={onOpen}
                          className="bg-edit-theme hover:bg-edit-hover-theme text-white">
                          <MdOutlineEdit />
                        </Button>
                        <Button
                          isIconOnly
                          radius="sm"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this brand?"
                              )
                            ) {
                              deleteProductTypeData(productType.product_type_id)
                                .then(() => {
                                  fetchProductCategories();
                                })
                                .catch((error) => {
                                  console.error("An error occurred:", error);
                                });
                            }
                          }}
                          className="bg-delete-theme hover:bg-delete-hover-theme text-white">
                          <MdDeleteOutline />
                        </Button>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell>
                      {productType[columnKey as keyof typeof productType]}
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

export default ManageProductCategories;
