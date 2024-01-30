"use client";
import { PropsWithChildren, useRef } from "react";
import { Provider } from "react-redux";
import { store, persistor, type AppStore } from "~/lib/store";
import { PersistGate } from "redux-persist/integration/react";

/**
 * Provides the internal in-memory redux store to the page components.
 */
export const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = store;
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate persistor={persistor} loading={null}>
        {children}
      </PersistGate>
    </Provider>
  );
};
