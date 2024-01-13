import { Chip, ListItem, ListItemText } from "@mui/material";
import * as React from "react";
import {
  type IDisplayableTransaction,
  removeParticipantFromTransaction,
  removeTransaction,
} from "~/lib/features/core";
import { useAppDispatch } from "~/lib/hooks";

interface TransactionListItemProps {
  item: IDisplayableTransaction;
}

export default function TransactionListItem({
  item,
}: TransactionListItemProps) {
  const dispatch = useAppDispatch();

  return (
    <ListItem key={item.id}>
      <ListItemText>
        {Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(item.amount)}
        <br />
        {item.participants.map((i) => {
          const onDeleteHandler = () => {
            if (item.participants.length === 1) {
              dispatch(removeTransaction(item.id));
            } else {
              dispatch(
                removeParticipantFromTransaction({
                  transactionId: item.id,
                  participantId: i.personId,
                })
              );
            }
          };

          return (
            <Chip
              key={item.id + i.personId}
              label={i.participantDisplayName}
              onDelete={onDeleteHandler}
            />
          );
        })}
      </ListItemText>
    </ListItem>
  );
}
