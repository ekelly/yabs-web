"use client"
import { Storage } from "redux-persist";

export default function createWebStorage(): Storage {
  const storage = window.localStorage;
  return {
    getItem: (key: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const value = storage.getItem(key);
        if (value) {
            resolve(value);
        } else {
            reject("Key not present");
        }
      })
    },
    setItem: (key: string, item: string): Promise<void> => {
      return new Promise((resolve) => {
        resolve(storage.setItem(key, item))
      })
    },
    removeItem: (key: string): Promise<void> => {
      return new Promise((resolve) => {
        resolve(storage.removeItem(key))
      })
    },
  }
}