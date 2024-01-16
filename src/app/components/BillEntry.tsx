"use client";
import { Button, FormHelperText, Box } from "@mui/material";
import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  getTransactions,
  clearBill,
  getBillState,
} from "~/lib/features/core";
import { addToHistory } from "~/lib/features/history";
import { useAppDispatch, useShallowEqualSelector } from "~/lib/hooks";
import BillInfo from "./BillInfo";
import TransactionList from "./TransactionList";
import { store } from "~/lib/store";
import { useRouter } from "next/navigation";
import AddTransactionArea from "./AddTransactionArea";

export default function BillEntry() {
  const dispatch = useAppDispatch();
  const transactions = useShallowEqualSelector(getTransactions);
  const billState = useSelector(getBillState);
  const { id, total, description } = billState;

  const [error, setError] = useState<string | undefined>();
  const router = useRouter();

  const displayTransaction = (billId: string) => {
    console.log(store.getState());
    router.push("/summary?billId=" + billId);
  };

  const doneHandler = useCallback(() => {
    if (description === "") {
      setError("Bill must have a name");
      return;
    }
    if (!total || total <= 0) {
      setError("Bill total must be positive");
      return;
    }
    console.log("Saving bill state");
    setError(undefined);
    dispatch(addToHistory());
    dispatch(clearBill());
    displayTransaction(id);
  }, [dispatch, id, description, total]);

  return (
    <>
      <BillInfo />
      <Box>
        <TransactionList items={transactions} />
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
