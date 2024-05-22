"use client";

import { fetchAllStockRequestsData } from "@/app/api/stockRequestData";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { createClient } from "@/utils/supabase/client";
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
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

type RestockRequest = {
  request_id: number;
  store_id: number;
  product_id: number;
  requested_quantity: number;
  request_date: string;
  status: string;
  vendor_id: number;
  vendor_name: string;
  vendor_location: string;
  store_name: string;
  product_name: string;
};

type VendorRestockInventoryProp = {
  vendorId: number;
};

const VendorRestockInventory: React.FC<VendorRestockInventoryProp> = ({
  vendorId,
}) => {
  const supabase = createClient();

  const [vendorInventory, setVendorInventory] = useState<RestockRequest[]>([]);

  // fetching
  const entriesPerPage = 10;
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [numOfEntries, setNumOfEntries] = useState(1);
  const [loadingState, setLoadingState] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const totalPages = Math.ceil(numOfEntries / entriesPerPage);

  const [otherFilter, setOtherFilter] = useState("");

  // for modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchVendorInventory = async () => {
    try {
      setLoadingState("loading");
      const response = await fetchAllStockRequestsData(
        vendorId,
        searchValue,
        entriesPerPage,
        currentPage,
        otherFilter
      );
      if (response?.error) {
        console.error(response.error);
        setLoadingState("error");
      } else {
        setVendorInventory(response.data as RestockRequest[]);
        setNumOfEntries(response.count || 1);
        setLoadingState("idle");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoadingState("error");
    }
  };

  useEffect(() => {
    fetchVendorInventory();

    const channel = supabase
      .channel(`realtime stock_requests:vendor_id=eq.${vendorId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Stock_Requests",
          filter: "vendor_id=eq." + vendorId,
        },
        (payload) => {
          if (payload.new) {
            fetchVendorInventory();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [vendorId, searchValue, entriesPerPage, currentPage, otherFilter]);

  const columns = [
    { key: "store_name", label: "Store Name" },
    { key: "product_name", label: "Product Name" },
    { key: "request_date", label: "Request Date" },
    { key: "requested_quantity", label: "Requested Quantity" },
    { key: "status", label: "Status" },
  ];

  return (
    <>
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
            <Select
              name="status-filter"
              variant="flat"
              aria-label="Status Filter"
              defaultSelectedKeys={["Pending"]}
              onChange={(e) => {
                setOtherFilter(e.target.value);
              }}>
              <SelectItem key={"Pending"} value="Pending">
                Pending
              </SelectItem>
              <SelectItem key={"Done"} value="Done">
                Done
              </SelectItem>
            </Select>
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
            items={vendorInventory}
            emptyContent={"No rows to display."}
            loadingContent={<Spinner color="secondary" />}
            loadingState={loadingState}>
            {(venInv) => (
              <TableRow key={venInv.request_id} className="text-center">
                {(columnKey) => {
                  if (columnKey === "status") {
                    return (
                      <TableCell>
                        <Button
                          color={
                            venInv.status === "Pending" && venInv
                              ? "warning"
                              : "secondary"
                          }
                          variant="ghost"
                          onClick={() => {
                            // setCurrentProductId(inventory.product_id);
                            // if (inventory.status === "Pending") {
                            //   setRequestNewStock(false);
                            // } else {
                            //   setRequestNewStock(true);
                            // }
                          }}
                          //   onPress={openRestock}
                        >
                          {venInv.status === "Pending" ? "Pending" : "Restock"}
                        </Button>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell>
                      {venInv[columnKey as keyof typeof venInv]}
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

export default VendorRestockInventory;
