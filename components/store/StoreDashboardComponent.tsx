"use client";

import React, { useEffect, useState } from "react";
import StoreInventory from "./components/StoreInventory";
import {
  editStoreData,
  fetchSpecificStoreDetailsData,
  insertStoreData,
} from "@/app/api/storesData";
import { getUser } from "@/utils/functions/userFetch";
import { useUser } from "@/hooks/useUser";
import NextImage from "next/image";
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
  TimeInput,
  useDisclosure,
} from "@nextui-org/react";
import { parseAbsoluteToLocal, Time } from "@internationalized/date";
import { DateTimeFormatter } from "@js-joda/core";

type Store = {
  store_id: number;
  store_name: string;
  store_location: string;
  store_operating_hours: string;
  store_manager_id: string;
};

function StoreDashboardComponent() {
  const [storeExisting, setStoreExisting] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);

  const [loadingState, setLoadingState] = useState<
    "idle" | "loading" | "error"
  >("idle");

  const user = useUser();

  const fetchSpecificStore = async () => {
    if (!user) return;
    try {
      setLoadingState("loading");
      const response = await fetchSpecificStoreDetailsData(user?.id);

      if (response && response.length > 0) {
        setStoreExisting(true);
        setStores(response as Store[]);
        setLoadingState("idle");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoadingState("error");
    }
  };

  useEffect(() => {
    fetchSpecificStore();
  }, [user]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [inputStoreName, setInputStoreName] = useState("");
  const [inputStoreLocation, setInputStoreLocation] = useState("");
  const [inputStoreOpeningTime, setInputStoreOpeningTime] = useState(
    new Time(9, 0)
  );
  const [inputStoreClosingTime, setInputStoreClosingTime] = useState(
    new Time(19, 0)
  );

  // edit store
  const [editingStore, setEditingStore] = useState<{
    store_id: number;
    store_name: string;
    store_location: string;
    store_operating_hours: string;
    store_manager_id: string;
  } | null>(null);

  const handleAddOrEditStore = async () => {
    const storeData = {
      store_name: inputStoreName,
      store_location: inputStoreLocation,
      store_operating_hours: `${inputStoreOpeningTime} - ${inputStoreClosingTime}`,
      store_manager_id: user?.id,
    };

    try {
      if (editingStore) {
        await editStoreData(editingStore.store_id, user?.id, storeData);
      } else {
        await insertStoreData(storeData);
      }

      fetchSpecificStore();

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
    setInputStoreName("");
    setInputStoreLocation("");
    setInputStoreOpeningTime(new Time(9, 0));
    setInputStoreClosingTime(new Time(19, 0));
    setEditingStore(null);
  };

  const [formattedOpeningTime, setFormattedOpeningTime] = useState<
    string | undefined
  >();
  const [formattedClosingTime, setFormattedClosingTime] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (stores && stores[0]?.store_operating_hours) {
      const [openingTime, closingTime] =
        stores[0].store_operating_hours.split(" - ");

      const convertTo12HourFormat = (time: string) => {
        const [hour, minute] = time.split(":");
        const hourNumber = parseInt(hour);
        const suffix = hourNumber >= 12 ? "PM" : "AM";
        return `${((hourNumber + 11) % 12) + 1}:${minute} ${suffix}`;
      };

      setFormattedOpeningTime(convertTo12HourFormat(openingTime));
      setFormattedClosingTime(convertTo12HourFormat(closingTime));
    }
  }, [stores]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpen}
        onClose={onClose}
        isDismissable={false}>
        <ModalContent>
          <ModalHeader className="text-xl font-bold text-main-theme">
            {storeExisting ? "Edit Store" : "Add Store"}
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 w-full gap-3">
              <div className="form-container">
                <label htmlFor="store_name" className="form-label">
                  Store Name
                </label>
                <Input
                  type="text"
                  id="store_name"
                  name="store_name"
                  placeholder="Store Name"
                  value={inputStoreName}
                  onChange={(e) => setInputStoreName(e.target.value)}
                />
              </div>
              <div className="form-container">
                <label htmlFor="store_location" className="form-label">
                  Store Location
                </label>
                <Input
                  type="text"
                  id="store_location"
                  name="store_location"
                  placeholder="
                 Store Location
                 "
                  value={inputStoreLocation}
                  onChange={(e) => setInputStoreLocation(e.target.value)}
                />
              </div>
              <div className="form-container">
                <label htmlFor="store_operating_house" className="form-label">
                  Opening Time
                </label>
                <TimeInput
                  aria-labelledby="store_opening_time"
                  id="store_opening_time"
                  name="store_opening_time"
                  value={inputStoreOpeningTime}
                  onChange={setInputStoreOpeningTime}
                />
              </div>
              <div className="form-container">
                <label htmlFor="store_closing_time" className="form-label">
                  Closing Time
                </label>
                <TimeInput
                  aria-labelledby="store_closing_time"
                  id="store_closing_time"
                  name="store_closing_time"
                  value={inputStoreClosingTime}
                  onChange={setInputStoreClosingTime}
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
              onPress={handleAddOrEditStore}
              disabled={
                !inputStoreName ||
                !inputStoreLocation ||
                !inputStoreOpeningTime ||
                !inputStoreClosingTime
              }
              className={`bg-main-theme text-white ${
                !inputStoreName ||
                !inputStoreLocation ||
                !inputStoreOpeningTime ||
                !inputStoreClosingTime
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-main-hover-theme"
              }`}>
              {storeExisting ? "Edit" : "Add"} Store
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="flex justify-between items-center section-title">
        <h2>Store Dashboard</h2>
        <Button
          color="secondary"
          onClick={() => {
            setInputStoreName(stores[0].store_name);
            setInputStoreLocation(stores[0].store_location);
            const openingHours = stores[0].store_operating_hours
              .split(" - ")[0]
              .split(":");
            const closingHours = stores[0].store_operating_hours
              .split(" - ")[1]
              .split(":");

            setInputStoreOpeningTime(
              new Time(parseInt(openingHours[0]), parseInt(openingHours[1]))
            );
            setInputStoreClosingTime(
              new Time(parseInt(closingHours[0]), parseInt(closingHours[1]))
            );
            setEditingStore(stores[0]);
          }}
          onPress={onOpen}>
          {storeExisting ? "Edit" : "Add"} Store
        </Button>
      </div>
      <div className="h-full w-full flex flex-col justify-center">
        {storeExisting && (
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
                      {stores[0].store_name}
                    </h4>
                    <p className="text-tiny uppercase font-bold">
                      {stores[0].store_location}
                    </p>
                    <small className="text-default-500">{`${formattedOpeningTime} - ${formattedClosingTime}`}</small>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="w-full flex flex-col gap-4 mt-12">
              <StoreInventory />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default StoreDashboardComponent;
