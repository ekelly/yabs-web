import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  IAdjustment,
  IBillState,
  IPerson,
  ITransaction,
  PersonId,
  TransactionId,
} from "./types";
import { v4 as uuidv4 } from "uuid";
import { adjustTransactionPercentages } from "./billMath";

const createInitialParticipants = () => {
  const participants: Record<PersonId, IPerson> = {};
  const participantId = uuidv4();
  participants[participantId] = {
    name: "Me",
    share: 0,
    id: participantId,
  };
  return participants;
};

const createInitialState: () => IBillState = () => ({
  id: uuidv4(),
  description: "",
  participants: createInitialParticipants(),
  transactions: [],
});

const initialState: IBillState = createInitialState();

type RemoveParticipantFromTransactionPayload = {
  transactionId: TransactionId;
  participantId: PersonId;
};
type UpdateTransactionParticipantsPayload = {
  transactionId: TransactionId;
  participants: IAdjustment[];
};
type UpdateTransactionSharePayload = {
  transactionId: TransactionId;
  participantId: PersonId;
  share: number;
};
type UpdateTransactionAmountPayload = {
  transactionId: TransactionId;
  amount: number;
};

export const slice = createSlice({
  name: "slice-name",
  initialState,
  reducers: {
    upsertPerson: (state, action: PayloadAction<IPerson>) => {
      state.participants[action.payload.id] = action.payload;
    },
    removePerson: (state, action: PayloadAction<PersonId>) => {
      delete state.participants[action.payload];
    },
    addTransaction: (
      state,
      action: PayloadAction<Omit<ITransaction, "id">>
    ) => {
      const transation = action.payload;
      state.transactions.push({
        ...transation,
        id: uuidv4(),
      });
    },
    updateTransactionAmount: (
      state,
      action: PayloadAction<UpdateTransactionAmountPayload>
    ) => {
      const { transactionId, amount } = action.payload;
      state.transactions = state.transactions.map((transaction) => {
        if (transaction.id === transactionId) {
          return { ...transaction, amount };
        }
        return transaction;
      });
    },
    removeTransaction: (state, action: PayloadAction<TransactionId>) => {
      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload
      );
    },
    updateTransactionParticipants: (
      state,
      action: PayloadAction<UpdateTransactionParticipantsPayload>
    ) => {
      const { participants, transactionId } = action.payload;
      state.transactions = state.transactions.map((t) => {
        if (t.id === transactionId) {
          return {
            ...t,
            participants,
          };
        } else {
          return t;
        }
      });
    },
    removeParticipantFromTransaction: (
      state,
      action: PayloadAction<RemoveParticipantFromTransactionPayload>
    ) => {
      const { participantId, transactionId } = action.payload;
      state.transactions = [
        ...state.transactions.map((t) => {
          if (t.id === transactionId) {
            return adjustTransactionPercentages(t, participantId);
          }
          return t;
        }),
      ];
    },
    adjustParticipantShareOfTransaction: (
      state,
      action: PayloadAction<UpdateTransactionSharePayload>
    ) => {
      const { participantId, transactionId, share } = action.payload;
      state.transactions = [
        ...state.transactions.map((t) => {
          // TODO: When you remove a participant, make sure to divy up their
          // proportion of the transaction accordingly
          if (t.id === transactionId) {
            return {
              ...t,
              participants: t.participants.map((p) => {
                if (p.personId === participantId) {
                  return { ...p, adjustPercentage: share };
                }
                return p;
              }),
            };
          }
          return t;
        }),
      ];
    },
    setBillTotal: (state, action: PayloadAction<number | undefined>) => {
      state.total = action.payload;
    },
    setBillDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    clearBill: () => createInitialState(),
  },
});

// Exports

export const {
  upsertPerson,
  removePerson,
  addTransaction,
  updateTransactionAmount,
  removeTransaction,
  removeParticipantFromTransaction,
  adjustParticipantShareOfTransaction,
  updateTransactionParticipants,
  setBillTotal,
  setBillDescription,
  clearBill,
} = slice.actions;

export default slice.reducer;
