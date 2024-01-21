import * as React from "react";
import TransactionListItem from "./TransactionListItemV2";
import type { IBillState, IDisplayableTransaction } from "~/lib/features/core";
import { List } from "@mui/material";

interface TransactionListProps {
  items: IDisplayableTransaction[];
  participants: IBillState["participants"];
}

export default function TransactionList({
  items,
  participants,
}: TransactionListProps) {
  return (
    <List>
      {items.map((item) => (
        <TransactionListItem
          key={item.id}
          item={item}
          billParticipants={participants}
        />
      ))}
    </List>
  );
}
