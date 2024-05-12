"use client";

import React, { useState } from "react";

type Store = {
  store_id: number;
  store_name: string;
  store_location: string;
  store_operating_hours: string;
  store_manager: string;
};

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

  return <div></div>;
};

export default ManageStores;
