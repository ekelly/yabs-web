"use client";
import * as React from "react";
import { TransactionListItem } from "./TransactionListItem";
import {
  removeTransaction,
  type IBillState,
  type IDisplayableTransaction,
} from "~/lib/features/core";
import SwipeableList from "material-swipeable-list";
import { useCallback } from "react";
import { useAppDispatch } from "~/lib/hooks";

interface TransactionListProps {
  items: IDisplayableTransaction[];
  participants: IBillState["participants"];
}

/**
 * This component represents a list of transactions
 * within a bill.
 */
export const TransactionList: React.FC<TransactionListProps> = ({
  items,
  participants,
}) => {
  const dispatch = useAppDispatch();

  // Delete the transaction
  const deleteHandler = useCallback(
    (index: number) => {
      const item = items[index];
      if (item) {
        dispatch(removeTransaction(item.id));
      } else {
        console.warn(`Cannot find item ${index} in ${JSON.stringify(items)}`);
      }
    },
    [dispatch, items]
  );

  return (
    <SwipeableList
      items={items}
      onChange={deleteHandler}
      generateListItem={(item: IDisplayableTransaction) => (
        <TransactionListItem
          key={item.id}
          item={item}
          billParticipants={participants}
          editable={true}
        />
      )}
      generateKey={(item: IDisplayableTransaction) => item.id}
    />
  );
};
