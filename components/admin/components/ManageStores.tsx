"use client";

import { fetchAllStoresData } from "@/app/api/storesData";
import { SearchIcon } from "@/components/icons/SearchIcon";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Input,
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
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ManageStores = () => {
  const [stores, setStores] = useState<Store[]>([]);

  // fetching
  const [searchValue, setSearchValue] = useState("");
  const entriesPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [numOfEntries, setNumOfEntries] = useState(1);
  const [loadingState, setLoadingState] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const totalPages = Math.ceil(numOfEntries / entriesPerPage);

  const fetchStores = async () => {
    try {
      setLoadingState("loading");
      const response = await fetchAllStoresData(
        searchValue,
        entriesPerPage,
        currentPage
      );
      if (response?.error) {
        console.error(response.error);
        setLoadingState("error");
      } else {
        setStores(response.data as Store[]);
        setNumOfEntries(response.count || 1);
        setLoadingState("idle");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoadingState("error");
    }
  };

  useEffect(() => {
    fetchStores();
  }, [searchValue, entriesPerPage, currentPage]);

  const columns = [
    { key: "store_name", label: "Store Name" },
    { key: "store_location", label: "Location" },
    { key: "store_operating_hours", label: "Operating Hours" },
    { key: "manager_name", label: "Manager Name" },
    { key: "manager_email", label: "Manager Email" },
  ];

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem className="section-link">
          <Link href="/authuser/admin/dashboard">Dashboard</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>View Stores</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="section-title">View Stores</h1>

      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold mb-2">Stores</h3>
          <div className="flex items-center gap-2">
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
          aria-label="Store Table"
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
            items={stores}
            emptyContent={"No rows to display."}
            loadingContent={<Spinner color="secondary" />}
            loadingState={loadingState}>
            {(store) => (
              <TableRow key={store.store_id} className="text-center">
                {(columnKey) => {
                  if (columnKey === "manager_name") {
                    return (
                      <TableCell>
                        {store.manager_first_name} {store.manager_last_name}
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell>
                      {store[columnKey as keyof typeof store]}
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

export default ManageStores;
