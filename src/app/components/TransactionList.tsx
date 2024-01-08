import * as React from "react";
import TransactionListItem from "./TransactionListItem";
import type { IDisplayableTransaction } from "~/lib/features/core";

interface TransactionListProps {
    items: IDisplayableTransaction[]
}

export default function TransactionList({ items }: TransactionListProps) {
    return (<ul>
        {items.map((item) => <TransactionListItem key={item.id} item={item} />)}
    </ul>);
}