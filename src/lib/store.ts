"use client"
import { configureStore } from "@reduxjs/toolkit";
import { billReducer } from "~/lib/features/core";
import { historyReducer } from "./features/history";
import { combineReducers } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import createWebStorage from "./localStorage";

const rootReducer = combineReducers({
    bill: billReducer,
    history: historyReducer,
});

const persistConfig = {
    key: 'root',
    storage: createWebStorage(),
    debug: false
};

export const makeStore = () => {
    return configureStore({
        reducer: persistReducer(persistConfig, rootReducer),
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: {
              ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    })
};

export const store = makeStore();

export const persistor = persistStore(store);

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
