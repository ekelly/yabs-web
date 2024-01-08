import * as React from "react";
import { IDisplayableTransaction } from "~/lib/features/core";

interface TransactionListItemProps {
    item: (IDisplayableTransaction),
}

export default function TransactionListItem({ item }: TransactionListItemProps) {
    return <li key={item.id}>{item.amount} - {item.participants.map(i => i.participantDisplayName)}</li>
}