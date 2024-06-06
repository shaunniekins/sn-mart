// store.tsx

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import cartReducer from "./features/products/cartReducer";
import storeReducer from "./features/store/storeReducer"; // import storeReducer

const persistConfig = {
  key: "root",
  storage,
};

// cart and store will be restored when application is reloaded
const persistedCartReducer = persistReducer(persistConfig, cartReducer);
const persistedStoreReducer = persistReducer(
  { ...persistConfig, key: "store" },
  storeReducer
);

export const makeStore = configureStore({
  reducer: {
    cart: persistedCartReducer,
    store: persistedStoreReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof makeStore.getState>;
export type AppDispatch = typeof makeStore.dispatch;

export const persistor = persistStore(makeStore);
