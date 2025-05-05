"use client";

import {
  deleteProductData,
  editProductData,
  fetchAllProductsData,
  insertProductData,
} from "@/app/api/productsData";
import { useState, useEffect } from "react";

import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";

import {
  Autocomplete,
  AutocompleteItem,
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
import Link from "next/link";
import { fetchBrandsData } from "@/app/api/brandsData";
import { fetchProductTypesData } from "@/app/api/productTypesData";
import Image from "next/image";
import { SearchIcon } from "@/components/icons/SearchIcon";

// --- Add computeSHA256 function here (outside the component) ---
async function computeSHA256(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const hashBuffer = await window.crypto.subtle.digest(
          "SHA-256",
          arrayBuffer
        );
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        resolve(String(hashHex));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}
// --- End computeSHA256 function ---

type Brand = {
  brand_id: number;
  brand_name: string;
};

type ProductType = {
  product_type_id: number;
  product_type_name: string;
};

type ExtendedProduct = Product & {
  image_url?: string | null;
};

const ManageProductCatalog = () => {
  const [products, setProducts] = useState<ExtendedProduct[]>([]);

  // fetching
  const [searchValue, setSearchValue] = useState("");
  const entriesPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [numOfEntries, setNumOfEntries] = useState(1);
  const [loadingState, setLoadingState] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const totalPages = Math.ceil(numOfEntries / entriesPerPage);

  const fetchProducts = async () => {
    try {
      setLoadingState("loading");
      const response = await fetchAllProductsData(
        searchValue,
        entriesPerPage,
        currentPage
      );
      if (response?.error) {
        console.error(response.error);
        setLoadingState("error");
      } else {
        setProducts(response.data as ExtendedProduct[]);
        console.log("response", response.data);
        setNumOfEntries(response.count || 1);
        setLoadingState("idle");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoadingState("error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchValue, entriesPerPage, currentPage]);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  const fetchBrands = async () => {
    try {
      const response = await fetchBrandsData();
      if (response === null) {
        console.error("An error occurred while fetching brands data");
      } else {
        setBrands(response as Brand[]);
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
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchProductTypes();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [inputProductName, setInputProductName] = useState("");
  const [inputUpcCode, setInputUpcCode] = useState("");
  const [inputSize, setInputSize] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>();
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<
    number | null
  >();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
    setUploadError(null);
  };

  const handleAddOrEditProduct = async () => {
    setUploading(true);
    setUploadError(null);
    let imageUrl: string | null | undefined = editingProduct?.image_url;

    if (selectedFile) {
      try {
        const fileType = selectedFile.type;
        const fileSize = selectedFile.size;
        const fileName = selectedFile.name;

        console.log("Computing checksum for:", fileName);
        const checksum = await computeSHA256(selectedFile);
        console.log("Checksum computed:", checksum);

        console.log("--- Calling API Route /api/upload-image ---");
        const apiResponse = await fetch("/api/upload-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contentType: fileType,
            fileSize: fileSize,
            checksum: checksum,
          }),
        });

        const result = await apiResponse.json();
        console.log("API Route response:", result);

        if (!apiResponse.ok || !result.success) {
          throw new Error(
            result.failure || `API Error: ${apiResponse.statusText}`
          );
        }

        const { url, publicUrl } = result.success;

        console.log("Uploading file to S3:", url);
        const uploadResponse = await fetch(url, {
          method: "PUT",
          body: selectedFile,
          headers: {
            "Content-Type": fileType,
          },
        });
        console.log("S3 Upload response status:", uploadResponse.status);

        if (!uploadResponse.ok) {
          let s3Error = `Failed to upload image to S3. Status: ${uploadResponse.status}`;
          try {
            const s3ErrorText = await uploadResponse.text();
            console.error("S3 Upload Error Body:", s3ErrorText);
            s3Error += ` - ${s3ErrorText.substring(0, 200)}`;
          } catch (_) {}
          throw new Error(s3Error);
        }

        imageUrl = publicUrl;
        // console.log("Image URL set to:", imageUrl);
      } catch (error: any) {
        console.error("Image upload process failed:", error);
        setUploadError(error.message || "Image upload failed.");
        setUploading(false);
        return;
      }
    }

    const productData = {
      product_name: inputProductName,
      upc_code: inputUpcCode,
      size: inputSize,
      price: parseFloat(inputPrice),
      brand_id: selectedBrandId || null,
      product_type_id: selectedProductTypeId || null,
      image_url: imageUrl,
    };

    try {
      console.log("Saving product data:", productData);
      if (editingProduct) {
        await editProductData(editingProduct.product_id, productData);
        console.log("Product updated successfully.");
      } else {
        await insertProductData(productData);
        console.log("Product inserted successfully.");
      }

      fetchProducts();
      handleRemoveInputValues();
      onClose();
    } catch (error) {
      console.error("Database operation failed:", error);
      setUploadError(
        `Failed to save product data: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setUploading(false);
    }
  };

  const [editingProduct, setEditingProduct] = useState<ExtendedProduct | null>(
    null
  );

  useEffect(() => {
    if (!isOpen) {
      handleRemoveInputValues();
    }
  }, [isOpen]);

  const handleRemoveInputValues = () => {
    setInputProductName("");
    setInputUpcCode("");
    setInputSize("");
    setInputPrice("");
    setSelectedBrandId(null);
    setSelectedProductTypeId(null);
    setEditingProduct(null);
    setSelectedFile(null);
    setUploading(false);
    setUploadError(null);
  };

  const columns = [
    { key: "image", label: "Image" },
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
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpen}
        onClose={onClose}
        isDismissable={false}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader className="text-xl font-bold text-main-theme">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 w-full gap-3">
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
                  }}
                >
                  {brands.map((brand) => (
                    <AutocompleteItem
                      key={brand.brand_id}
                      value={brand.brand_id.toString()}
                    >
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
                  }}
                >
                  {productTypes.map((type) => (
                    <AutocompleteItem
                      key={type.product_type_id}
                      value={type.product_type_id.toString()}
                    >
                      {type.product_type_name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
              <div className="form-container col-span-2">
                <label htmlFor="product_image" className="form-label">
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md">
                    Select Image
                    <input
                      type="file"
                      id="product_image"
                      name="product_image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-sm">
                    {selectedFile ? selectedFile.name : "No file selected"}
                  </span>
                </div>
                {selectedFile && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">
                      File selected: {selectedFile.name}
                    </p>
                  </div>
                )}
                {editingProduct?.image_url && !selectedFile && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Current Image:</p>
                    <Image
                      src={editingProduct.image_url}
                      alt={editingProduct.product_name}
                      width={80}
                      height={80}
                      className="object-cover rounded"
                    />
                  </div>
                )}
                {uploadError && (
                  <p className="text-sm text-red-500 mt-1">{uploadError}</p>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button
              color="primary"
              onPress={handleAddOrEditProduct}
              disabled={
                !inputProductName ||
                !inputUpcCode ||
                !inputPrice ||
                !selectedBrandId ||
                !selectedProductTypeId ||
                uploading
              }
              isLoading={uploading}
              className={`bg-main-theme text-white ${
                !inputProductName ||
                !inputUpcCode ||
                !inputPrice ||
                !selectedBrandId ||
                !selectedProductTypeId ||
                uploading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-main-hover-theme"
              }`}
            >
              {uploading
                ? "Saving..."
                : editingProduct
                ? "Update Product"
                : "Add Product"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Breadcrumbs>
        <BreadcrumbItem className="section-link">
          <Link href="/authuser/admin/dashboard">Dashboard</Link>
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
              onPress={onOpen}
            >
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
          aria-label="Product Catalog Table"
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
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                className="bg-main-theme text-white text-center"
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={products}
            emptyContent={"No rows to display."}
            loadingContent={<Spinner color="secondary" />}
            loadingState={loadingState}
          >
            {(product) => (
              <TableRow key={product.product_id} className="text-center">
                {(columnKey) => {
                  if (columnKey === "image") {
                    return (
                      <TableCell>
                        <Image
                          src={product.image_url || "/images/sn-mart-logo.jpeg"}
                          alt={product.product_name}
                          width={50}
                          height={50}
                          className="object-cover rounded mx-auto"
                        />
                      </TableCell>
                    );
                  }
                  if (columnKey === "actions") {
                    return (
                      <TableCell className="flex gap-2 justify-center">
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
                          }}
                          onPress={onOpen}
                          className="bg-edit-theme hover:bg-edit-hover-theme text-white"
                        >
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
                          className="bg-delete-theme hover:bg-delete-hover-theme text-white"
                        >
                          <MdDeleteOutline />
                        </Button>
                      </TableCell>
                    );
                  }
                  if (columnKey === "price") {
                    return <TableCell>${product.price}</TableCell>;
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
      </div>
    </>
  );
};

export default ManageProductCatalog;
