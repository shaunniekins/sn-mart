// storeReducer.tsx

"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StoreState {
  selectedStore: Store | null;
}

const initialState: StoreState = {
  selectedStore: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    selectStore: (state, action: PayloadAction<Store>) => {
      state.selectedStore = action.payload;
    },
    removeSelectedStore: (state) => {
      state.selectedStore = null;
    },
  },
});

export const { selectStore, removeSelectedStore } = storeSlice.actions;
export default storeSlice.reducer;
