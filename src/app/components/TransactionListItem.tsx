"use client";
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
import { isTouchEnabled } from "~/lib/utils";

interface TransactionListItemProps {
  item: IDisplayableTransaction;
  billParticipants: IBillState["participants"];
  editable?: boolean;
}

/**
 * An individual transaction within a list of transactions. It is
 * editable in bill entry view, and not editable in the history view.
 */
export const TransactionListItem: React.FC<TransactionListItemProps> = ({
  item,
  billParticipants,
  editable,
}) => {
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);

  // Helper function to determine if a participant
  // is part of this transaction
  const isParticipantInTransaction = (personId: string) => {
    return !!item.participants.find(
      (adjustment) => adjustment.personId === personId
    );
  };

  const handleDelete = () => dispatch(removeTransaction(item.id));

  const handleOnClick = (personId: string) => {
    // If we're not in editable mode, do nothing on click.
    if (!editable) {
      return;
    }
    if (isParticipantInTransaction(personId)) {
      // Remove the participant from the transaction
      dispatch(
        removeParticipantFromTransaction({
          transactionId: item.id,
          participantId: personId,
        })
      );
    } else {
      // Add the participant to the transaction, and readjust
      // the percentages associated with each participant
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

  /**
   * The 'amount' component is either an editable
   * input field, or just text.
   */
  const AmountComponent = editMode ? (
    <TransactionCostInput
      transactionId={item.id}
      onBlur={() => setEditMode(false)}
      initialAmount={item.amount.toString()}
    />
  ) : (
    <ListItemText
      onClick={() => {
        setEditMode(!!editable && true);
      }}
    >
      {Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(item.amount)}
    </ListItemText>
  );

  let participants = Object.keys(billParticipants);
  if (!editable) {
    participants = participants.filter(isParticipantInTransaction);
  }

  return (
    <ListItem
      key={item.id}
      divider
      sx={{ flexDirection: "column", alignItems: "flex-start" }}
    >
      {isTouchEnabled() || !editable ? null : (
        <IconButton
          size="small"
          sx={{ alignSelf: "flex-end", position: "absolute" }}
          onClick={handleDelete}
        >
          <CloseIcon />
        </IconButton>
      )}
      {AmountComponent}
      <Box sx={{ flex: "1 100%" }}>
        {participants.map((personId) => {
          return (
            <PersonChip
              id={personId}
              variant={
                isParticipantInTransaction(personId) ? "outlined" : "filled"
              }
              key={item.id + personId}
              label={billParticipants[personId].name}
              onClick={editable ? () => handleOnClick(personId) : undefined}
            />
          );
        })}
      </Box>
    </ListItem>
  );
};
