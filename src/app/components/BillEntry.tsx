"use client";
import { Divider } from "@mui/material";
import { useState, useCallback } from "react";
import { useAppSelector } from "~/lib/hooks";
import { getTransactions, clearBill, getBillState } from "~/lib/features/core";
import { addToHistory } from "~/lib/features/history";
import { useAppDispatch } from "~/lib/hooks";
import { BillInfo } from "./BillInfo";
import { TransactionList } from "./TransactionList";
import { useRouter } from "next/navigation";
import { AddTransactionArea } from "./AddTransactionArea";
import { calculatePersonTotals } from "~/lib/features/core/billMath";
import { SubtotalView } from "./SubtotalView";
import { ErrorMessage } from "./ErrorMessage";
import { SaveFAB } from "./SaveFAB";

/**
 * This is the root component for adding details to the
 * currently active "Bill"
 */
export const BillEntry: React.FC = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(getTransactions);
  const billState = useAppSelector(getBillState);
  const { id, total, description, participants } = billState;

  const [error, setError] = useState<string | undefined>();
  const router = useRouter();

  const personTotals = calculatePersonTotals(billState);

  const doneHandler = useCallback(() => {
    if (description === "") {
      setError("Bill must have a description");
      return;
    }
    if (!total || total <= 0) {
      setError("Bill total must be positive");
      return;
    }
    if (transactions.length <= 0) {
      setError("Bill must have transactions");
      return;
    }
    if (!transactions.every((t) => t.participants.length > 0)) {
      setError("All transactions need participants");
      return;
    }
    setError(undefined);
    dispatch(addToHistory());
    dispatch(clearBill());
    router.push("/summary?billId=" + id);
  }, [description, total, transactions, dispatch, router, id]);

  return (
    <>
      <BillInfo />
      <Divider />
      <SaveFAB
        doneHandler={doneHandler}
        hasTransactions={transactions.length > 0}
      />
      <TransactionList items={transactions} participants={participants} />
      <AddTransactionArea />
      {transactions.length ? <Divider /> : null}
      <ErrorMessage message={error} triggerError={setError} />
      <SubtotalView
        transactions={transactions}
        participants={billState.participants}
        personTotals={personTotals}
      />
    </>
  );
};
