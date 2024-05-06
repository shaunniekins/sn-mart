"use client";

import {
  deleteProductData,
  editProductData,
  fetchAllProductsData,
  insertProductData,
} from "@/app/api/productsData";
import { useState, useEffect, Fragment, use } from "react";

import {
  MdDeleteOutline,
  MdNavigateBefore,
  MdNavigateNext,
  MdOutlineEdit,
} from "react-icons/md";

import {
  Autocomplete,
  AutocompleteItem,
  Breadcrumbs,
  BreadcrumbItem,
  Button,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";

import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { fetchBrandsData } from "@/app/api/brandsData";
import { fetchProductTypesData } from "@/app/api/productTypesData";
import { SearchIcon } from "@/components/SearchIcon";

type Product = {
  product_id: number;
  product_name: string;
  upc_code: string;
  size: string;
  price: number;
  brand_id: number | null;
  brand_name: string;
  product_type_id: number | null;
  product_type_name: string;
};

type Brand = {
  brand_id: number;
  brand_name: string;
};

type ProductType = {
  product_type_id: number;
  product_type_name: string;
};

const ManageProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const [searchValue, setSearchValue] = useState("");
  const entriesPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [numOfEntries, setNumOfEntries] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetchAllProductsData(
        searchValue,
        entriesPerPage,
        currentPage
      );
      if (response?.error) {
        console.error(response.error);
      } else {
        setProducts(response.data as Product[]);
        setNumOfEntries(response.count || 1);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchValue, entriesPerPage, currentPage]);

  const totalPages = Math.ceil(numOfEntries / entriesPerPage);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  const fetchBrands = async () => {
    try {
      const response = await fetchBrandsData();
      if (response === null) {
        console.error("An error occurred while fetching brands data");
      } else {
        setBrands(response as Brand[]);
        // console.log("brands", response);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const fetchProductTypes = async () => {
    try {
      const response = await fetchProductTypesData();
      if (response === null) {
        console.error("An error occurred while fetching product types data");
      } else {
        setProductTypes(response as ProductType[]);
        // console.log("product types", response);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchProductTypes();
  }, []);

  // new product add
  const [inputProductName, setInputProductName] = useState("");
  const [inputUpcCode, setInputUpcCode] = useState("");
  const [inputSize, setInputSize] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>();
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<
    number | null
  >();

  const handleAddOrEditProduct = async () => {
    const productData = {
      product_name: inputProductName,
      upc_code: inputUpcCode,
      size: inputSize,
      price: parseFloat(inputPrice),
      brand_id: selectedBrandId || null,
      product_type_id: selectedProductTypeId || null,
    };

    try {
      if (editingProduct) {
        await editProductData(editingProduct.product_id, productData);
      } else {
        await insertProductData(productData);
      }

      setIsModalOpen(false);
      fetchProducts();

      setInputProductName("");
      setInputUpcCode("");
      setInputSize("");
      setInputPrice("");
      setSelectedBrandId(null);
      setSelectedProductTypeId(null);
      setEditingProduct(null);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // edit spedific product
  const [editingProduct, setEditingProduct] = useState<{
    product_id: number;
    product_name: string;
    upc_code: string;
    size: string;
    price: number;
    brand_id: number | null;
    brand_name: string;
    product_type_id: number | null;
    product_type_name: string;
  } | null>(null);

  const columns = [
    { key: "product_name", label: "Product Name" },
    { key: "upc_code", label: "UPC Code" },
    { key: "size", label: "Size" },
    { key: "price", label: "Price" },
    { key: "brand_name", label: "Brand" },
    { key: "product_type_name", label: "Category" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <>
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsModalOpen(false)}>
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-xl leading-6 font-bold text-main-theme">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </Dialog.Title>
              <div className="w-full">
                <div className="grid grid-cols-2 w-full my-5">
                  <div className="form-container">
                    <label htmlFor="product_name" className="form-label">
                      Product Name
                    </label>
                    <Input
                      type="text"
                      id="product_name"
                      name="product_name"
                      placeholder="Product Name"
                      value={inputProductName}
                      onChange={(e) => setInputProductName(e.target.value)}
                    />
                  </div>
                  <div className="form-container">
                    <label htmlFor="upc_code" className="form-label">
                      UPC Code
                    </label>
                    <Input
                      type="text"
                      id="upc_code"
                      name="upc_code"
                      placeholder="0000-0000-0000"
                      value={inputUpcCode}
                      onChange={(e) => setInputUpcCode(e.target.value)}
                    />
                  </div>
                  <div className="form-container">
                    <label htmlFor="size" className="form-label">
                      Size
                    </label>
                    <Input
                      type="text"
                      id="size"
                      name="size"
                      placeholder="Size"
                      value={inputSize}
                      onChange={(e) => setInputSize(e.target.value)}
                    />
                  </div>
                  <div className="form-container">
                    <label htmlFor="price" className="form-label">
                      Price
                    </label>
                    <Input
                      type="number"
                      id="price"
                      name="price"
                      placeholder="Price"
                      value={inputPrice}
                      onChange={(e) => setInputPrice(e.target.value)}
                    />
                  </div>
                  <div className="form-container">
                    <label htmlFor="brand" className="form-label">
                      Brand
                    </label>
                    <Autocomplete
                      label="Select a brand"
                      id="brand"
                      className="max-w-xs"
                      defaultInputValue={
                        editingProduct && editingProduct.brand_id
                          ? editingProduct.brand_name.toString()
                          : ""
                      }
                      onInputChange={(value) => {
                        const selectedBrand = brands.find(
                          (brand) => brand.brand_name.toString() === value
                        );
                        if (selectedBrand) {
                          setSelectedBrandId(selectedBrand.brand_id);
                        }
                      }}>
                      {brands.map((brand) => (
                        <AutocompleteItem
                          key={brand.brand_id}
                          value={brand.brand_id.toString()}>
                          {brand.brand_name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="form-container">
                    <label htmlFor="product_type" className="form-label">
                      Product Type
                    </label>
                    <Autocomplete
                      label="Select a type"
                      id="product_type"
                      className="max-w-xs"
                      defaultInputValue={
                        editingProduct && editingProduct.product_type_id
                          ? editingProduct.product_type_name.toString()
                          : ""
                      }
                      onInputChange={(value) => {
                        const selectedProductType = productTypes.find(
                          (type) => type.product_type_name.toString() === value
                        );
                        if (selectedProductType) {
                          setSelectedProductTypeId(
                            selectedProductType.product_type_id
                          );
                        }
                      }}>
                      {productTypes.map((type) => (
                        <AutocompleteItem
                          key={type.product_type_id}
                          value={type.product_type_id.toString()}>
                          {type.product_type_name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    radius="md"
                    onClick={() => {
                      setIsModalOpen(false);
                      setInputProductName("");
                      setInputUpcCode("");
                      setInputSize("");
                      setInputPrice("");
                      setSelectedBrandId(null);
                      setSelectedProductTypeId(null);
                    }}
                    className="bg-disabled-theme hover:bg-disabled-hover-theme text-white">
                    Close
                  </Button>
                  <Button
                    radius="md"
                    onClick={handleAddOrEditProduct}
                    disabled={
                      !inputProductName ||
                      !inputUpcCode ||
                      !inputPrice ||
                      !selectedBrandId ||
                      !selectedProductTypeId
                    }
                    className={`bg-main-theme text-white ${
                      !inputProductName ||
                      !inputUpcCode ||
                      !inputPrice ||
                      !selectedBrandId ||
                      !selectedProductTypeId
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-main-hover-theme"
                    }`}>
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Breadcrumbs>
        <BreadcrumbItem className="section-link">
          <Link href="/admin/protected">Dashboard</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>Manage Product Catalog</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="section-title">Manage Product Catalog</h1>

      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold mb-2">Existing Products</h3>
          <div className="flex items-center gap-2">
            <Button
              radius="md"
              className="bg-main-theme hover:bg-main-hover-theme text-white"
              onClick={() => setIsModalOpen(true)}>
              + Add
            </Button>
            <Input
              // label="Search"
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
                  // "shadow-xl",
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
        <Table aria-label="Product Catalog Table">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                className="bg-main-theme text-white">
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={products} emptyContent={"No rows to display."}>
            {(product) => (
              <TableRow key={product.product_id}>
                {(columnKey) => {
                  if (columnKey === "actions") {
                    return (
                      <TableCell className="flex gap-2">
                        <Button
                          isIconOnly
                          radius="sm"
                          onClick={() => {
                            setInputProductName(product.product_name);
                            setInputUpcCode(product.upc_code);
                            setInputSize(product.size);
                            setInputPrice(product.price.toString());
                            setSelectedBrandId(product.brand_id);
                            setSelectedProductTypeId(product.product_type_id);
                            setEditingProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="bg-edit-theme hover:bg-edit-hover-theme text-white">
                          <MdOutlineEdit />
                        </Button>
                        <Button
                          isIconOnly
                          radius="sm"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this product?"
                              )
                            ) {
                              deleteProductData(product.product_id)
                                .then(() => {
                                  fetchProducts();
                                })
                                .catch((error) => {
                                  console.error(
                                    "Error deleting product:",
                                    error
                                  );
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
                      {product[columnKey as keyof typeof product]}
                    </TableCell>
                  );
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center">
          <h3 className="text-gray-500 text-sm">
            Page {currentPage} of {totalPages}
          </h3>
          <div className="flex justify-end items-center gap-3">
            <Button
              isIconOnly
              radius="md"
              onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
              disabled={currentPage === 1}
              className="navigate-buttons">
              <MdNavigateBefore />
            </Button>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                let pageNumber = e.target.value ? parseInt(e.target.value) : 1;
                if (pageNumber < 1) pageNumber = 1;
                if (pageNumber > totalPages) pageNumber = totalPages;
                setCurrentPage(pageNumber);
              }}
              className="text-center"
            />
            <Button
              isIconOnly
              radius="md"
              onClick={() =>
                setCurrentPage((old) => Math.min(old + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="navigate-buttons">
              <MdNavigateNext />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageProductCatalog;
