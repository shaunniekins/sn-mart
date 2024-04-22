// store.tsx

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/products/cartReducer";

export const makeStore = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof makeStore.getState>;
export type AppDispatch = typeof makeStore.dispatch;
