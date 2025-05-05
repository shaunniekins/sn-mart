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

import Link from "next/link";
import {
  deleteProductTypeData,
  editProductTypeData,
  fetchAllProductTypesData,
  insertProductTypeData,
} from "@/app/api/productTypesData";
import { SearchIcon } from "@/components/icons/SearchIcon";
import Image from "next/image";

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

type ProductType = {
  product_type_id: number;
  product_type_name: string;
  image_url?: string | null;
};

const ManageProductCategories = () => {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [editingProductType, setEditingProductType] =
    useState<ProductType | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
    setUploadError(null);
  };

  const handleAddOrEditProductType = async () => {
    setUploading(true);
    setUploadError(null);
    let imageUrl: string | null | undefined = editingProductType?.image_url;

    if (selectedFile) {
      try {
        const fileType = selectedFile.type;
        const fileSize = selectedFile.size;
        const checksum = await computeSHA256(selectedFile);

        const apiResponse = await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentType: fileType,
            fileSize: fileSize,
            checksum: checksum,
          }),
        });

        const result = await apiResponse.json();
        if (!apiResponse.ok || !result.success) {
          throw new Error(
            result.failure || `API Error: ${apiResponse.statusText}`
          );
        }

        const { url, publicUrl } = result.success;

        const uploadResponse = await fetch(url, {
          method: "PUT",
          body: selectedFile,
          headers: { "Content-Type": fileType },
        });

        if (!uploadResponse.ok) {
          let s3Error = `Failed to upload image to S3. Status: ${uploadResponse.status}`;
          try {
            const s3ErrorText = await uploadResponse.text();
            s3Error += ` - ${s3ErrorText.substring(0, 200)}`;
          } catch (_) {}
          throw new Error(s3Error);
        }
        imageUrl = publicUrl;
      } catch (error: any) {
        console.error("Image upload process failed:", error);
        setUploadError(error.message || "Image upload failed.");
        setUploading(false);
        return;
      }
    }

    try {
      if (editingProductType) {
        console.log("Updating product type:", {
          id: editingProductType.product_type_id,
          name: inputProductTypeName,
          imageUrl,
        });
        const response = await editProductTypeData(
          editingProductType.product_type_id,
          inputProductTypeName,
          imageUrl
        );
        if (response?.error) {
          throw response.error;
        }
      } else {
        console.log("Adding new product type:", {
          name: inputProductTypeName,
          imageUrl,
        });
        const response = await insertProductTypeData(
          inputProductTypeName,
          imageUrl
        );
        if (response?.error) {
          throw response.error;
        }
      }

      fetchProductCategories();
      handleRemoveInputValues();
      onClose();
    } catch (error: any) {
      console.error("Database operation failed:", error);

      // Enhanced error handling to extract more detailed information
      let errorMessage = "An unknown error occurred";

      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.details) {
        errorMessage = error.details;
      } else if (error?.hint) {
        errorMessage = error.hint;
      } else if (error?.code) {
        errorMessage = `Error code: ${error.code}`;
      } else if (typeof error === "object") {
        try {
          errorMessage = JSON.stringify(error);
        } catch {
          errorMessage = "Error object could not be stringified";
        }
      }

      setUploadError(`Failed to save product type data: ${errorMessage}`);
    } finally {
      setUploading(false);
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
    setSelectedFile(null);
    setUploading(false);
    setUploadError(null);
  };

  const columns = [
    { key: "image", label: "Image" },
    { key: "product_type_name", label: "Product Type Name" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpen}
        onClose={onClose}
        isDismissable={false}
        size="xl"
      >
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
              <div className="form-container col-span-1">
                <label htmlFor="product_type_image" className="form-label">
                  Category Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md">
                    Select Image
                    <input
                      type="file"
                      id="product_type_image"
                      name="product_type_image"
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
                {editingProductType?.image_url && !selectedFile && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Current Image:</p>
                    <Image
                      src={editingProductType.image_url}
                      alt={editingProductType.product_type_name}
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
              onPress={handleAddOrEditProductType}
              disabled={!inputProductTypeName || uploading}
              isLoading={uploading}
              className={`bg-main-theme text-white ${
                !inputProductTypeName || uploading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-main-hover-theme"
              }`}
            >
              {uploading
                ? "Saving..."
                : editingProductType
                ? "Edit Product Type"
                : "Add Product Type"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Breadcrumbs>
        <BreadcrumbItem className="section-link">
          <Link href="/authuser/admin/dashboard">Dashboard</Link>
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
            items={productTypes}
            emptyContent={"No rows to display."}
            loadingContent={<Spinner color="secondary" />}
            loadingState={loadingState}
          >
            {(productType) => (
              <TableRow
                key={productType.product_type_id}
                className="text-center"
              >
                {(columnKey) => {
                  if (columnKey === "image") {
                    return (
                      <TableCell>
                        <Image
                          src={
                            productType.image_url || "/images/sn-mart-logo.jpeg"
                          }
                          alt={productType.product_type_name}
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
                            setInputProductTypeName(
                              productType.product_type_name
                            );
                            setEditingProductType(productType);
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
                                "Are you sure you want to delete this product type?"
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
                          className="bg-delete-theme hover:bg-delete-hover-theme text-white"
                        >
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
