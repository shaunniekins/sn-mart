"use client";

import {
  editVendorData,
  fetchSpecificVendorDetailsData,
  insertVendorData,
} from "@/app/api/vendorsData";
import { useUser } from "@/hooks/useUser";
import {
  Button,
  Card,
  CardBody,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import NextImage from "next/image";
import React, { useEffect, useState } from "react";
import VendorRestockInventory from "./components/VendorRestockInventory";

type Vendor = {
  vendor_id: number;
  vendor_name: string;
  vendor_location: string;
  vendor_manager_id: string;
};

function SupplierDashboardComponent() {
  const [vendorExisting, setVendorExisting] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const [loadingState, setLoadingState] = useState<
    "idle" | "loading" | "error"
  >("idle");

  const user = useUser();

  const fetchSpecificVendor = async () => {
    if (!user) return;

    try {
      setLoadingState("loading");
      const response = await fetchSpecificVendorDetailsData(user?.id);

      if (response && response.length > 0) {
        setVendorExisting(true);
        setVendors(response as Vendor[]);
        setLoadingState("idle");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoadingState("error");
    }
  };

  useEffect(() => {
    fetchSpecificVendor();
  }, [user]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [inputVendorName, setInputVendorName] = useState("");
  const [inputVendorLocation, setInputVendorLocation] = useState("");

  // edit vendor
  const [editingVendor, setEditingVendor] = useState<{
    vendor_id: number;
    vendor_name: string;
    vendor_location: string;
    vendor_manager_id: string;
  } | null>(null);

  const handleAddOrEditVendor = async () => {
    const vendorData = {
      vendor_name: inputVendorName,
      vendor_location: inputVendorLocation,
      vendor_manager_id: user?.id,
    };

    try {
      if (editingVendor) {
        await editVendorData(
          editingVendor.vendor_id,
          editingVendor.vendor_manager_id,
          vendorData
        );
      } else {
        await insertVendorData(vendorData);
      }

      fetchSpecificVendor();

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
    setInputVendorName("");
    setInputVendorLocation("");
    setEditingVendor(null);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpen}
        onClose={onClose}
        isDismissable={false}>
        <ModalContent>
          <ModalHeader className="text-xl font-bold text-main-theme">
            {vendorExisting ? "Edit Vendor" : "Add Vendor"}
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 w-full gap-3">
              <div className="form-container">
                <label htmlFor="vendor_name" className="form-label">
                  Vendor Name
                </label>
                <Input
                  type="text"
                  id="vendor_name"
                  name="vendor_name"
                  placeholder="Vendor Name"
                  value={inputVendorName}
                  onChange={(e) => setInputVendorName(e.target.value)}
                />
              </div>
              <div className="form-container">
                <label htmlFor="vendor_location" className="form-label">
                  Vendor Location
                </label>
                <Input
                  type="text"
                  id="vendor_location"
                  name="vendor_location"
                  placeholder="Vendor Location"
                  value={inputVendorLocation}
                  onChange={(e) => setInputVendorLocation(e.target.value)}
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
              onPress={handleAddOrEditVendor}
              disabled={!inputVendorName || !inputVendorLocation}
              className={`bg-main-theme text-white ${
                !inputVendorName || !inputVendorLocation
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-main-hover-theme"
              }`}>
              {vendorExisting ? "Edit Vendor" : "Add Vendor"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="flex justify-between items-center section-title">
        <h2>Vendor Dashboard</h2>
        <Button
          color="secondary"
          onClick={() => {
            if (vendors && vendors.length > 0) {
              setInputVendorName(vendors[0].vendor_name);
              setInputVendorLocation(vendors[0].vendor_location);
              setEditingVendor(vendors[0]);
            }
          }}
          onPress={onOpen}>
          {vendorExisting ? "Edit" : "Add"} Vendor
        </Button>
      </div>
      <div className="h-full w-full flex flex-col justify-center">
        {vendorExisting && (
          <>
            <div className="gap-4">
              <Card>
                <CardBody className="flex flex-row items-center gap-4">
                  <div className="bg-purple-200 rounded-2xl w-[70%] flex justify-center">
                    <Image
                      as={NextImage}
                      src="/images/sn-mart-logo.svg"
                      alt="SN Mart Logo"
                      width={200}
                      height={45}
                      className="rounded-full"
                    />
                  </div>
                  <div className="w-[30%]">
                    <h4 className="font-bold text-xl text-main-theme">
                      {vendors[0].vendor_name}
                    </h4>
                    <p className="text-tiny uppercase font-bold">
                      {vendors[0].vendor_location}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="w-full flex flex-col gap-4 mt-12">
              <VendorRestockInventory vendorId={vendors[0]?.vendor_id} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default SupplierDashboardComponent;
