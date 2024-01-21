"use client";
import { Button, FormHelperText, Box } from "@mui/material";
import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { getTransactions, clearBill, getBillState } from "~/lib/features/core";
import { addToHistory } from "~/lib/features/history";
import { useAppDispatch, useShallowEqualSelector } from "~/lib/hooks";
import BillInfo from "./BillInfo";
import TransactionList from "./TransactionList";
import { useRouter } from "next/navigation";
import AddTransactionArea from "./AddTransactionAreaV2";

export default function BillEntry() {
  const dispatch = useAppDispatch();
  const transactions = useShallowEqualSelector(getTransactions);
  const billState = useSelector(getBillState);
  const { id, total, description, participants } = billState;

  const [error, setError] = useState<string | undefined>();
  const router = useRouter();

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
    if (
      transactions.reduce((acc, t) => acc || t.participants.length === 0, false)
    ) {
      setError("All transactions need participants");
      return;
    }
    console.log("Saving bill state");
    setError(undefined);
    dispatch(addToHistory());
    dispatch(clearBill());
    router.push("/summary?billId=" + id);
  }, [description, total, transactions.length, dispatch, router, id]);

  return (
    <>
      <BillInfo />
      <Box>
        <TransactionList items={transactions} participants={participants} />
        <AddTransactionArea />
      </Box>
      <br />
      <Button variant="contained" onClick={doneHandler}>
        done
      </Button>
      <FormHelperText error>{error}</FormHelperText>
    </>
  );
}
