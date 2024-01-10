export {
    removeFromHistory,
    clearAllHistory,
} from "./historySlice";
export {
    getHistoricalBill,
    getHistory,
} from "./selectors";
export {
    addToHistory,
} from "./actions";
import reducer from "./historySlice";

export const historyReducer = reducer;