export {
    addToHistory,
    removeFromHistory,
    clearAllHistory,
} from "./historySlice";
import reducer from "./historySlice";

export const historyReducer = reducer;