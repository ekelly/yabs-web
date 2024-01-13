import * as React from "react";
import TransactionListItem from "./TransactionListItem";
import type { IDisplayableTransaction } from "~/lib/features/core";
import { List } from "@mui/material";

interface TransactionListProps {
  items: IDisplayableTransaction[];
}

export default function TransactionList({ items }: TransactionListProps) {
  return (
    <List>
      {items.map((item) => (
        <TransactionListItem key={item.id} item={item} />
      ))}
    </List>
  );
}
