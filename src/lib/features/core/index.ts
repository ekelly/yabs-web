import reducer from "./billSlice";
export { 
    addPerson,
    removePerson,
    updatePerson,
    addTransaction,
    removeTransaction,
    removeParticipantFromTransaction,
    adjustParticipantShareOfTransaction,
    setBillTotal, 
    setBillDescription,
    getTransactions,
    clearBill
} from "./billSlice";

export const billReducer = reducer;