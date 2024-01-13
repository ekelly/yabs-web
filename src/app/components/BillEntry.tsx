"use client";
import { Fab, Button, Typography, FormHelperText } from "@mui/material";
import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  getTransactions,
  getParticipants,
  getBillId,
  clearBill,
  addTransaction,
  getBillDescription,
  getBillTotal,
} from "~/lib/features/core";
import { addToHistory, getHistory } from "~/lib/features/history";
import { useAppDispatch, useShallowEqualSelector } from "~/lib/hooks";
import AddTransactionModal from "./AddTransactionModal";
import BillInfo from "./BillInfo";
import SummaryView from "./SummaryView";
import TransactionList from "./TransactionList";

export default function BillEntry() {
  const dispatch = useAppDispatch();
  const transactions = useShallowEqualSelector(getTransactions);
  const participants = useSelector(getParticipants);
  const billId = useSelector(getBillId);
  const billDescription = useSelector(getBillDescription);
  const billTotal = useSelector(getBillTotal);

  const [showModal, setShowModal] = useState(false);
  const [summaryState, setSummaryState] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  const displayTransaction = (billId: string) => {
    setSummaryState(billId);
  };

  const doneHandler = useCallback(() => {
    if (billDescription === "") {
      setError("Bill must have a name");
      return;
    }
    if (!billTotal || billTotal <= 0) {
      setError("Bill total must be positive");
      return;
    }
    console.log("Saving bill state");
    setError(undefined);
    dispatch(addToHistory());
    dispatch(clearBill());
    displayTransaction(billId);
  }, [dispatch, billId, billDescription, billTotal]);

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
      <TransactionList items={transactions} />

      <Button onClick={addTransactionHandler}>random transaction</Button>
      <br />
      <Button variant="contained" onClick={doneHandler}>
        done
      </Button>
      <FormHelperText error>{error}</FormHelperText>

      <Fab
        onClick={() => setShowModal(true)}
        sx={{ position: "absolute", bottom: "16px", right: "16px" }}
      >
        +
      </Fab>
      <SummaryView id={summaryState} />
    </>
  );
}
