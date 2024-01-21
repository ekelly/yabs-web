import { IAdjustment, ITransaction } from "../core/types";
import { IHistoryItem } from "./types";

type IDisplayableAdjustment = IAdjustment & { participantDisplayName: string };
export type IDisplayableTransaction = Omit<ITransaction, "participants"> & {
  participants: Array<IDisplayableAdjustment>;
};
export const getDisplayableTransactions = (
  historicalBill: IHistoryItem
): IDisplayableTransaction[] => {
  const transactions = historicalBill.transactions;
  const people = historicalBill.participants;
  return transactions.map((t) => ({
    ...t,
    participants: t.participants.map((a) => ({
      ...a,
      participantDisplayName: people[a.personId]?.name ?? "",
    })),
  }));
};
