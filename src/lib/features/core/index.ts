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
    clearBill,
    getTransactions,
    getParticipants,
} from "./billSlice";

export const billReducer = reducer;