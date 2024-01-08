import type { RootState } from "~/lib/store";
import { IAdjustment, ITransaction } from "./types";

// Selectors

type IDisplayableAdjustment = IAdjustment & { participantDisplayName: string };
export type IDisplayableTransaction = Omit<ITransaction, "participants"> & { 
    participants: Array<IDisplayableAdjustment>;
};
export const getTransactions = (state: RootState): IDisplayableTransaction[] => {
    const transactions = state.bill.transactions;
    const people = state.bill.participants;
    return transactions.map((t) => ({
        ...t,
        participants: t.participants.map(a => ({
            ...a,
            participantDisplayName: people[a.personId]?.name ?? ""
        }))
    }));
  };
  
  export const getParticipants = (state: RootState) => {
    return state.bill.participants;
  };

  export const getBillDescription = (state: RootState) => {
    return state.bill.description;
  };

  export const getBillTotal = (state: RootState) => {
    return state.bill.total;
  };