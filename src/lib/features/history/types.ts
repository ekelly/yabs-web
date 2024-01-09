import type { IBillState } from "~/lib/features/core";

export type IHistoryItem = IBillState;
export interface IHistoryState {
    records: Array<IHistoryItem>;
}
