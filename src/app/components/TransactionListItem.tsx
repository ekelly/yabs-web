import * as React from "react";
import { IDisplayableTransaction, removeParticipantFromTransaction, removeTransaction } from "~/lib/features/core";
import { ChipSet } from "~/app/ui/ChipSet";
import { InputChip } from "~/app/ui/InputChip";
import { useAppDispatch } from "~/lib/hooks";

interface TransactionListItemProps {
    item: (IDisplayableTransaction),
}

export default function TransactionListItem({ item }: TransactionListItemProps) {
    const dispatch = useAppDispatch();

    return <li key={item.id}>{item.amount}<br/><ChipSet>{item.participants.map(i => {

        const onClickHandler = () => {
            if (item.participants.length === 1) {
                dispatch(removeTransaction(item.id));
            } else {
                dispatch(removeParticipantFromTransaction({
                    transactionId: item.id,
                    participantId: i.personId,
                }));
            }
        };

        return <InputChip label={i.participantDisplayName} onClick={onClickHandler}></InputChip>;
    })}</ChipSet></li>
}