import { useSelector } from "react-redux";
import {
  getBillDescription,
  getBillTotal,
  setBillDescription,
  setBillTotal,
} from "~/lib/features/core";
import { useAppDispatch } from "~/lib/hooks";
import { ChangeEvent, useCallback } from "react";

export default function BillInfo() {
  const dispatch = useAppDispatch();

  const billDescription = useSelector(getBillDescription);
  const billTotal = useSelector(getBillTotal);

  const updateBillNameHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(setBillDescription(e.currentTarget.value));
    },
    [dispatch]
  );

  const updateBillTotalHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(setBillTotal(Number(e.currentTarget.value)));
    },
    [dispatch]
  );

  return (
    <>
      <div>
        <input
          placeholder="Bill Name"
          value={billDescription}
          onChange={updateBillNameHandler}
        />
        <input
          placeholder="Bill Total"
          value={billTotal ?? ""}
          onChange={updateBillTotalHandler}
        />
      </div>
    </>
  );
}
