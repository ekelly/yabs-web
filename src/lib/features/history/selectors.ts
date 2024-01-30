"use client";
import type { RootState } from "~/lib/store";
import type { IHistoryItem } from "./types";
import { calculateBillShares, type IDisplayableBill } from "../core/billMath";

// Selector

export const getHistoricalBill = (
  state: RootState,
  id: string
): IHistoryItem | undefined => {
  return state.history.records.find((item) => item.id === id);
};

export type IDisplayableHistoricalBill = IDisplayableBill & { id: string };
export const getHistory = (state: RootState): IDisplayableHistoricalBill[] => {
  return state.history.records.reduce(
    (acc: IDisplayableHistoricalBill[], historyItem: IHistoryItem) => {
      const displayableItem = calculateBillShares(historyItem);
      if (displayableItem !== null) {
        return [...acc, { ...displayableItem, id: historyItem.id }];
      }
      return acc;
    },
    []
  );
};
