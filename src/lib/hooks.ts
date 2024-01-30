"use client";
import { useDispatch, useSelector, useStore, shallowEqual } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch, AppStore } from "./store";

// Use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;

// Use where the selector is returning a new object
export function useShallowEqualSelector<T>(
  selector: (state: RootState) => T
): T {
  return useSelector(selector, shallowEqual);
}
