import { useSelector } from "react-redux";
import { useCallback } from "react";
import type { RootState } from "~/lib/store";
import { getHistoricalBill } from "~/lib/features/history";

interface SummaryViewProps {
    id: string;
}

export default function SummaryView({ id }: SummaryViewProps) {
    const billDetails = useSelector(useCallback((state: RootState) => {
        return getHistoricalBill(state, id);
    }, [id]));

    if (!billDetails) {
        return <div>Empty summary</div>;
    }

    return (
        <>
            <div>
                {billDetails?.description} - {billDetails?.total}
            </div>
        </>
    );
}
