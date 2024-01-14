import reducer from "./billSlice";
export {
  removePerson,
  upsertPerson,
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
  getBillState,
} from "./selectors";
export type { IDisplayableTransaction } from "./selectors";
export type { IBillState } from "./types";

export const billReducer = reducer;
