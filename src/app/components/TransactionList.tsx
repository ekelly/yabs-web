import * as React from "react";
import TransactionListItem from "./TransactionListItemV2";
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

export default function TransactionList({
  items,
  participants,
}: TransactionListProps) {
  const dispatch = useAppDispatch();

  const deleteHandler = useCallback(
    (index: number) => {
      const item = items[index];
      dispatch(removeTransaction(item.id));
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
        />
      )}
      generateKey={(item: IDisplayableTransaction) => item.id}
    />
  );
}
