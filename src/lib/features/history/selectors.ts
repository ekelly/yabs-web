import type { RootState } from "~/lib/store";
import type { IHistoryItem } from "./types";

// Selector

export const getHistoricalBill = (state: RootState, id: string): IHistoryItem | undefined => {
    return state.history.records.find(item => item.id === id);
};

export const getHistory = (state: RootState) => state.history;
