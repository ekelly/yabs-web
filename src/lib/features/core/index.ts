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
} from "./billSlice";
export {
    getTransactions,
    getParticipants,
    getBillDescription,
    getBillTotal,
} from "./selectors";
export type {
    IDisplayableTransaction
} from "./selectors";

export const billReducer = reducer;