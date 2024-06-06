// cartReducer.tsx

"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
  items: {
    [productId: number]: {
      product: Product;
      quantity: number;
    };
  };
}

const initialState: CartState = {
  items: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const productId = product.product_id;

      if (state.items[productId]) {
        state.items[productId].quantity += 1;
      } else {
        state.items[productId] = {
          product,
          quantity: 1,
        };
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      if (state.items[productId]) {
        if (quantity > 0) {
          state.items[productId].quantity = quantity;
        } else {
          state.items[productId].quantity = 1;
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      delete state.items[productId];
    },
    clearCart: (state) => {
      state.items = {};
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
