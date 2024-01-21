import { Box, IconButton, ListItem, ListItemText } from "@mui/material";
import * as React from "react";
import {
  type IDisplayableTransaction,
  removeParticipantFromTransaction,
  updateTransactionParticipants,
  removeTransaction,
  IBillState,
} from "~/lib/features/core";
import { useAppDispatch } from "~/lib/hooks";
import { PersonChip } from "./PersonChip";
import { useState } from "react";
import { TransactionCostInput } from "./TransactionCostInput";
import CloseIcon from "@mui/icons-material/Close";

interface TransactionListItemProps {
  item: IDisplayableTransaction;
  billParticipants: IBillState["participants"];
}

export default function TransactionListItem({
  item,
  billParticipants,
}: TransactionListItemProps) {
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);

  const isParticipantInTransaction = (personId: string) => {
    return !!item.participants.find(
      (adjustment) => adjustment.personId === personId
    );
  };

  const handleDelete = () => dispatch(removeTransaction(item.id));

  const handleOnClick = (personId: string) => {
    if (isParticipantInTransaction(personId)) {
      dispatch(
        removeParticipantFromTransaction({
          transactionId: item.id,
          participantId: personId,
        })
      );
    } else {
      const currentParticipantCount = item.participants.length + 1;
      const adjustPercentage = 1 / currentParticipantCount;
      dispatch(
        updateTransactionParticipants({
          transactionId: item.id,
          participants: [
            ...item.participants.map((a) => {
              return {
                ...a,
                adjustPercentage,
              };
            }),
            { personId, adjustPercentage },
          ],
        })
      );
    }
  };

  const amountComponent = editMode ? (
    <TransactionCostInput
      transactionId={item.id}
      onBlur={() => setEditMode(false)}
      initialAmount={item.amount.toString()}
    />
  ) : (
    <ListItemText
      onClick={() => {
        setEditMode(true);
      }}
    >
      {Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(item.amount)}
    </ListItemText>
  );

  return (
    <ListItem
      key={item.id}
      divider
      sx={{ flexDirection: "column", alignItems: "flex-start" }}
    >
      <IconButton
        size="small"
        sx={{ alignSelf: "flex-end", position: "absolute" }}
        onClick={handleDelete}
      >
        <CloseIcon />
      </IconButton>

      {amountComponent}
      <Box sx={{ flex: "1 100%" }}>
        {Object.keys(billParticipants).map((personId) => {
          return (
            <PersonChip
              id={personId}
              variant={
                isParticipantInTransaction(personId) ? "outlined" : "filled"
              }
              key={item.id + personId}
              label={billParticipants[personId].name}
              onClick={() => handleOnClick(personId)}
            />
          );
        })}
      </Box>
    </ListItem>
  );
}
