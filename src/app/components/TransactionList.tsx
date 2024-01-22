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
}
