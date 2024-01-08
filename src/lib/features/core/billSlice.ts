import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  IBillState,
  IPerson,
  ITransaction,
  PersonId,
  TransactionId,
} from "./types";
import { v4 as uuidv4 } from "uuid";

const createInitialState = () => {
    const participants: Record<PersonId, IPerson> = {};
    const participantId = uuidv4();
    participants[participantId] = {
        name: "Me",
        share: 0,
        id: participantId,
    };
    return ({
        id: uuidv4(),
        description: "",
        participants,
        transactions: [],
    });
}

const initialState: IBillState = createInitialState();

type UpdateTransactionPayload = {
  transactionId: TransactionId;
  participantId: PersonId;
};
type UpdateTransactionSharePayload = {
  transactionId: TransactionId;
  participantId: PersonId;
  share: number;
};

export const slice = createSlice({
  name: "slice-name",
  initialState,
  reducers: {
    addPerson: (state, action: PayloadAction<string>) => {
      console.log("Added a person!");
      const id = uuidv4();
      state.participants[id] = {
        id,
        name: action.payload,
      };
    },
    removePerson: (state, action: PayloadAction<PersonId>) => {
        delete state.participants[action.payload];
    },
    updatePerson: (state, action: PayloadAction<IPerson>) => {
        state.participants[action.payload.id] = action.payload;
    },
    addTransaction: (
      state,
      action: PayloadAction<Omit<ITransaction, "id">>
    ) => {
      console.log("Added transaction " + JSON.stringify(action.payload));
      state.transactions.push({
        ...action.payload,
        id: uuidv4(),
      });
    },
    removeTransaction: (state, action: PayloadAction<TransactionId>) => {
      state.transactions = [
        ...state.transactions.filter((t) => t.id !== action.payload),
      ];
    },
    removeParticipantFromTransaction: (
      state,
      action: PayloadAction<UpdateTransactionPayload>
    ) => {
      const { participantId, transactionId } = action.payload;
      state.transactions = [
        ...state.transactions.map((t) => {
          // TODO: When you remove a participant, make sure to divy up their
          // proportion of the transaction accordingly
          if (t.id === transactionId) {
            return {
              ...t,
              participants: t.participants.filter(
                (p) => p.personId === participantId
              ),
            };
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
    setBillTotal: (state, action: PayloadAction<number>) => {
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
  addPerson,
  removePerson,
  updatePerson,
  addTransaction,
  removeTransaction,
  removeParticipantFromTransaction,
  adjustParticipantShareOfTransaction,
  setBillTotal,
  setBillDescription,
  clearBill,
} = slice.actions;

export default slice.reducer;
