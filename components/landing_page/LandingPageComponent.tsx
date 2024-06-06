"use client";

import HeroSection from "./HeroSection";
import { useSelector } from "react-redux";
import type { RootState } from "@/utils/redux/store";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { memo, useEffect, useState } from "react";
import { fetchSpecificStoreUsingId, fetchStore } from "@/app/api/storesData";
import { useAppDispatch } from "@/utils/redux/hooks";
import { selectStore } from "@/utils/redux/features/store/storeReducer";
import DynamicProductCategories from "./DynamicProductCategories";

const LandingPageComponent = () => {
  const store = useSelector((state: RootState) => state.store);

  const [storeSelections, setStoreSelections] = useState<Store[]>([]);

  const [selectedStoreId, setSelectedStoreId] = useState<any | null>(null);

  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const fetchStores = async () => {
    const response = await fetchStore();
    if (response?.error) {
      console.error("Error fetching stores:", response);
    } else {
      setStoreSelections(response.data);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // redux
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchStore = async () => {
      if (selectedStoreId) {
        const stores = await fetchSpecificStoreUsingId(selectedStoreId);
        if (stores && stores.length > 0) {
          setSelectedStore(stores[0]);
        } else {
          setSelectedStore(null);
        }
      }
    };

    fetchStore();
  }, [selectedStoreId]);

  return (
    <>
      <Modal isOpen={store.selectedStore === null} hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Select store
              </ModalHeader>
              <ModalBody>
                <Autocomplete
                  aria-labelledby="store-selection"
                  defaultItems={storeSelections}
                  placeholder="Search for a store"
                  selectedKey={selectedStoreId}
                  onSelectionChange={setSelectedStoreId}
                  className="w-full">
                  {(store) => (
                    <AutocompleteItem key={store.store_id}>
                      {store.store_name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </ModalBody>
              <ModalFooter>
                <Button
                  color={!selectedStoreId ? "default" : "secondary"}
                  onPress={() => {
                    if (selectedStore) {
                      dispatch(selectStore(selectedStore));
                      window.location.reload();
                    }
                  }}
                  disabled={!selectedStoreId}>
                  Okay
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <HeroSection />
      <DynamicProductCategories />
    </>
  );
};

export default LandingPageComponent;
