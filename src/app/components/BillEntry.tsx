"use client";
import { Fab, Button, Typography, FormHelperText, Box } from "@mui/material";
import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  getTransactions,
  clearBill,
  addTransaction,
  getBillState,
} from "~/lib/features/core";
import { addToHistory } from "~/lib/features/history";
import { useAppDispatch, useShallowEqualSelector } from "~/lib/hooks";
import AddTransactionModal from "./AddTransactionModal";
import BillInfo from "./BillInfo";
import TransactionList from "./TransactionList";
import { store } from "~/lib/store";
import { useRouter } from "next/navigation";

export default function BillEntry() {
  const dispatch = useAppDispatch();
  const transactions = useShallowEqualSelector(getTransactions);
  const billState = useSelector(getBillState);
  const { participants, id, total, description } = billState;

  const [showModal, setShowModal] = useState(false);
  const [summaryState, setSummaryState] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();

  const displayTransaction = (billId: string) => {
    console.log(store.getState());
    // setSummaryState(billId);
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

  const addTransactionHandler = useCallback(() => {
    const numPeople = Math.floor(
      Math.random() * (Object.entries(participants).length - 1) + 1
    );
    const involved = Array.from(Object.entries(participants)).slice(
      0,
      numPeople
    );
    console.log(`adding transaction with ${JSON.stringify(involved)}`);
    dispatch(
      addTransaction({
        amount: Math.round(Math.random() * 100),
        participants: involved.map((person) => {
          return {
            personId: person[1].id,
            adjustPercentage: 1 / numPeople,
          };
        }),
      })
    );
  }, [dispatch, participants]);

  return (
    <>
      <BillInfo />
      <AddTransactionModal
        showModal={showModal}
        closeAction={() => setShowModal(false)}
      />
      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        <Fab
          onClick={() => setShowModal(true)}
          sx={{ position: { xs: "absolute", sm: "relative" }, bottom: { xs: 16, sm: 0 }, right: { xs: 16, sm: -52 }}}
        >
          +
        </Fab>
      </div>
      <Box sx={{ top: { xs: 0, sm: -52 }, position: "relative" }}>
        <TransactionList items={transactions} />
      </Box>

      <Button onClick={addTransactionHandler}>random transaction</Button>
      <br />
      <Button variant="contained" onClick={doneHandler}>
        done
      </Button>
      <FormHelperText error>{error}</FormHelperText>
      
    </>
  );
}
