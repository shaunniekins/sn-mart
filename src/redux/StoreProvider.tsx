// StoreProvider.tsx

"use client";
import { Provider } from "react-redux";
import { makeStore, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={makeStore}>
      {/* redux persist */}
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
