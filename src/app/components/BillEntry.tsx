"use client"
import { Chip, Fab, Button } from "@mui/material";
import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { getTransactions, getParticipants, getBillId, clearBill, addTransaction, addPerson } from "~/lib/features/core";
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
    
    const [showModal, setShowModal] = useState(false);
    const [summaryState, setSummaryState] = useState<string | null>(null);

    const displayTransaction = (billId: string) => {
        setSummaryState(billId);
    };

    const doneHandler = useCallback(() => {
        console.log("Saving bill state");
        dispatch(addToHistory());
        dispatch(clearBill());
        displayTransaction(billId);
    }, [dispatch, billId]);

    const addPersonHandler = useCallback(() => {
        dispatch(addPerson("New Person"));
      }, [dispatch]);

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

    return (<>
      <BillInfo />
      <AddTransactionModal
        showModal={showModal}
        closeAction={() => setShowModal(false)}
      />
      <br />
      <br />
      <Chip label="chip filled" />
      <Chip label="Chip Outlined" variant="outlined" />
      <br />
      <TransactionList items={transactions} />

      <Fab variant="extended" onClick={addPersonHandler}>
        +
      </Fab>
      <Fab variant="extended" onClick={addTransactionHandler}>
        transaction
      </Fab>
      <Fab variant="extended" onClick={() => setShowModal(true)}>
        transaction modal
      </Fab>
      <Button variant="contained" onClick={doneHandler}>
        done
      </Button>

      {summaryState !== null ? <SummaryView id={summaryState} /> : null}
    </>);
}