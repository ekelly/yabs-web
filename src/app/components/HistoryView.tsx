import { useSelector } from "react-redux";
import { getHistory } from "~/lib/features/history";


export default function HistoryView() {
    const history = useSelector(getHistory);

    return (
        <span>History size: {history.records.length}</span>
    );
}