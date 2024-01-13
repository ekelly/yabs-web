"use client"
import type { WebStorage } from "redux-persist";
import reduxStorage from "redux-persist/lib/storage";

export default function createWebStorage(): WebStorage {
    if (!global.window) {
        return reduxStorage;
    }
    const storage = window.localStorage;
    return {
        getItem: (key: string): Promise<string> => {
            console.log("KELERIC getItem");
            return new Promise((resolve, reject) => {
                const value = storage.getItem(key);
                if (value) {
                    resolve(value);
                } else {
                    reject("Key not present");
                }
            });
        },
        setItem: (key: string, item: string): Promise<void> => {
            console.log("KELERIC setItem");
            return new Promise((resolve) => {
                resolve(storage.setItem(key, item));
            });
        },
        removeItem: (key: string): Promise<void> => {
            console.log("KELERIC removeItem");
            return new Promise((resolve) => {
                resolve(storage.removeItem(key));
            });
        },
    }
}