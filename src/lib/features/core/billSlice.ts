import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { IBillState, IPerson, ITransaction, PersonId, TransactionId } from "./types";
import { v4 as uuidv4 } from "uuid";

const createInitialState = () => ({
    id: uuidv4(),
    description: "",
    participants: [{
        name: "Me",
        share: 0,
        id: uuidv4(),
    }],
    transactions: []
});

const initialState: IBillState = createInitialState();

export const slice = createSlice({
    name: "slice-name",
    initialState,
    reducers: {
        addPerson: (state, action: PayloadAction<IPerson>) => {
            state.participants.push(action.payload);
        },
        removePerson: (state, action: PayloadAction<PersonId>) => {
            state.participants = [...state.participants.filter((person) => person.id !== action.payload)];
        },
        updatePerson: (state, action: PayloadAction<IPerson>) => {
            state.participants = [...state.participants.filter((person) => person.id !== action.payload.id), action.payload];
        },
        addTransaction: (state, action: PayloadAction<ITransaction>) => {
            state.transactions.push(action.payload);
        },
        removeTransaction: (state, action: PayloadAction<TransactionId>) => {
            state.transactions = [...state.transactions.filter((t) => t.id !== action.payload)];
        },
        setBillTotal: (state, action: PayloadAction<number>) => {
            state.total = action.payload;
        },
        setBillDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload;
        },
        clearBill: () => createInitialState()
    }
});

export const { 
    addPerson, 
    removePerson, 
    updatePerson,
    addTransaction, 
    removeTransaction, 
    setBillTotal, 
    setBillDescription, 
    clearBill
} = slice.actions;
export default slice.reducer;