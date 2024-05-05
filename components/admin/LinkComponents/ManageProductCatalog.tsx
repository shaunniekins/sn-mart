"use client";

import {
  deleteProductData,
  fetchAllProductsData,
  insertProductData,
} from "@/app/api/productsData";
import { useState, useEffect, Fragment } from "react";
import {
  Button,
  ComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";
import {
  MdArrowDropDown,
  MdDeleteOutline,
  MdNavigateBefore,
  MdNavigateNext,
  MdOutlineEdit,
  MdOutlineSearch,
} from "react-icons/md";

import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { fetchBrandsData } from "@/app/api/brandsData";
import { fetchProductTypesData } from "@/app/api/productTypesData";

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

type ProductState = {
  product_name: string;
  upc_code: string;
  size: string;
  price: number;
  brand_id: number | null;
  product_type_id: number | null;
};

const initialProductState: ProductState = {
  product_name: "",
  upc_code: "",
  size: "",
  price: 0,
  brand_id: null,
  product_type_id: null,
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
  // const [newProduct, setNewProduct] = useState(initialProductState);

  const [searchValue, setSearchValue] = useState("");
  const entriesPerPage = 10;
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

  const [inputProductName, setInputProductName] = useState("");
  const [inputUpcCode, setInputUpcCode] = useState("");
  const [inputSize, setInputSize] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>();
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<
    number | null
  >();

  const [currentOptionBrandId, setCurrentOptionBrandId] = useState("");
  const [currentOptionProductTypeId, setCurrentOptionProductTypeId] =
    useState("");

  const handleAddProduct = async () => {
    const newProduct = {
      product_name: inputProductName,
      upc_code: inputUpcCode,
      size: inputSize,
      price: parseFloat(inputPrice),
      brand_id: selectedBrandId || null,
      product_type_id: selectedProductTypeId || null,
    };
    try {
      await insertProductData(newProduct);
      setIsModalOpen(false);
      fetchProducts();

      setInputProductName("");
      setInputUpcCode("");
      setInputSize("");
      setInputPrice("");
      setSelectedBrandId(null);
      setSelectedProductTypeId(null);
      setCurrentOptionBrandId("");
      setCurrentOptionProductTypeId("");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

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
                className="text-xl leading-6 font-bold text-purple-800">
                Add New Product
              </Dialog.Title>
              <div className="w-full">
                <div className="grid grid-cols-2 w-full my-5">
                  <div className="w-full px-2 mb-2">
                    <label htmlFor="product_name" className="combobox-label">
                      Product Name
                    </label>
                    <input
                      type="text"
                      id="product_name"
                      name="product_name"
                      placeholder="Product Name"
                      value={inputProductName}
                      onChange={(e) => setInputProductName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="w-full px-2 mb-2">
                    <label htmlFor="upc_code" className="combobox-label">
                      UPC Code
                    </label>
                    <input
                      type="text"
                      id="upc_code"
                      name="upc_code"
                      placeholder="0000-0000-0000"
                      value={inputUpcCode}
                      onChange={(e) => setInputUpcCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="w-full px-2 mb-2">
                    <label htmlFor="size" className="combobox-label">
                      Size
                    </label>
                    <input
                      type="text"
                      id="size"
                      name="size"
                      placeholder="Size"
                      value={inputSize}
                      onChange={(e) => setInputSize(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="w-full px-2 mb-2">
                    <label htmlFor="price" className="combobox-label">
                      Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      placeholder="Price"
                      value={inputPrice}
                      onChange={(e) => setInputPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="combobox-container">
                    <ComboBox
                      selectedKey={currentOptionBrandId}
                      onSelectionChange={(selected) => {
                        setCurrentOptionBrandId(
                          selected ? selected.toString() : ""
                        );
                      }}>
                      <Label className="combobox-label">Brand</Label>
                      <div className="combobox-input-group">
                        <Input
                          className="combobox-input"
                          placeholder="Select brand"
                        />
                        <Button className="combobox-button">
                          <MdArrowDropDown />
                        </Button>
                      </div>
                      <Popover className="combobox-popover">
                        <ListBox>
                          {brands.map((brand) => (
                            <ListBoxItem
                              key={brand.brand_id}
                              onHoverChange={(isHovered) => {
                                if (isHovered) {
                                  // console.log("brand_id: ", brand.brand_id);
                                  setSelectedBrandId(brand.brand_id);
                                }
                              }}
                              className="combobox-list-item">
                              {brand.brand_name}
                            </ListBoxItem>
                          ))}
                        </ListBox>
                      </Popover>
                    </ComboBox>
                  </div>
                  <div className="combobox-container">
                    <ComboBox
                      selectedKey={currentOptionProductTypeId}
                      onSelectionChange={(selected) => {
                        setCurrentOptionProductTypeId(
                          selected ? selected.toString() : ""
                        );
                      }}>
                      <Label className="combobox-label">Product Type</Label>
                      <div className="combobox-input-group">
                        <Input
                          className="combobox-input"
                          placeholder="Select type"
                        />
                        <Button className="combobox-button">
                          <MdArrowDropDown />
                        </Button>
                      </div>
                      <Popover className="combobox-popover">
                        <ListBox>
                          {productTypes.map((type) => (
                            <ListBoxItem
                              key={type.product_type_id}
                              onHoverChange={(isHovered) => {
                                if (isHovered) {
                                  // console.log(
                                  //   "product_type_id: ",
                                  //   type.product_type_id
                                  // );
                                  setSelectedProductTypeId(
                                    type.product_type_id
                                  );
                                }
                              }}
                              className="combobox-list-item">
                              {type.product_type_name}
                            </ListBoxItem>
                          ))}
                        </ListBox>
                      </Popover>
                    </ComboBox>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-xl">
                    Close
                  </button>
                  <button
                    onClick={handleAddProduct}
                    disabled={
                      !inputProductName ||
                      !inputUpcCode ||
                      !inputPrice ||
                      !currentOptionBrandId ||
                      !currentOptionProductTypeId
                    }
                    className={`bg-purple-500 text-white py-2 px-4 rounded-xl ${
                      !inputProductName ||
                      !inputUpcCode ||
                      !inputPrice ||
                      !currentOptionBrandId ||
                      !currentOptionProductTypeId
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-purple-600"
                    }`}>
                    Add Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="section-link-container">
        <Link href="/admin/protected" className="section-link">
          <h4>Dashboard</h4>
        </Link>
        <span>
          <h3>&nbsp;/&nbsp;</h3>
        </span>
        <h3>Manage Product Catalog</h3>
      </div>
      <h1 className="section-title">Manage Product Catalog</h1>

      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold mb-2">Existing Products</h3>
          <div className="flex gap-2">
            <button
              className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-xl"
              onClick={() => setIsModalOpen(true)}>
              + Add
            </button>
            <div className="relative">
              <MdOutlineSearch className="z-0 absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2 text-2xl" />
              <input
                type="text"
                placeholder="Search products"
                value={searchValue}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchValue(e.target.value);
                }}
                className="w-full border border-purple-700 focus:outline-none focus:ring-purple-700 focus:border-purple-700 focus:z-10 rounded-lg pl-3 pr-10 py-2"
              />
            </div>
          </div>
        </div>

        <div className="w-full min-h-[50svh]">
          <table className="table-auto w-full ">
            <thead>
              <tr>
                <th className="table-head-row">Product Name</th>
                <th className="table-head-row">UPC Code</th>
                <th className="table-head-row">Size</th>
                <th className="table-head-row">Price</th>
                <th className="table-head-row">Brand</th>
                <th className="table-head-row">Category</th>
                <th className="table-head-row">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.product_id}>
                  <td className="table-body-row">{product.product_name}</td>
                  <td className="table-body-row">{product.upc_code}</td>
                  <td className="table-body-row">{product.size}</td>
                  <td className="table-body-row">${product.price}</td>
                  <td className="table-body-row">{product.brand_name}</td>
                  <td className="table-body-row">
                    {product.product_type_name}
                  </td>
                  <td className="table-body-row flex">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded mr-2">
                      <MdOutlineEdit />
                    </button>
                    <button
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
                              console.error("Error deleting product:", error);
                            });
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded">
                      <MdDeleteOutline />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-5">
          <h3 className="text-gray-500">
            Page {currentPage} of {totalPages}
          </h3>
          <div className="flex justify-end items-center gap-3">
            <button
              onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
              disabled={currentPage === 1}
              className="navigate-buttons">
              <MdNavigateBefore />
            </button>
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
            <button
              onClick={() =>
                setCurrentPage((old) => Math.min(old + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="navigate-buttons">
              <MdNavigateNext />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageProductCatalog;
