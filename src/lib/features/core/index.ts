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
    getBillId,
} from "./selectors";
export type {
    IDisplayableTransaction
} from "./selectors";
export type {
    IBillState
} from "./types";

export const billReducer = reducer;