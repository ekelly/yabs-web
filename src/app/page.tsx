"use client";

import { useAppDispatch } from "~/lib/hooks";
import {
  addPerson,
  addTransaction,
  getTransactions,
  getParticipants,
  clearBill,
  getBillId,
} from "~/lib/features/core";
import { useSelector } from "react-redux";
import { useCallback, useState } from "react";
import BillInfo from "./components/BillInfo";
import { useShallowEqualSelector } from "~/lib/hooks";
import TransactionList from "./components/TransactionList";
import { Button, Chip, Dialog, DialogActions, Fab } from "@mui/material";
import { addToHistory } from "~/lib/features/history";
import SummaryView from "~/app/components/SummaryView";
import AddTransactionModal from "./components/AddTransactionModal";
import { getHistory } from "~/lib/features/history/historySlice";

export default function Page() {
  const dispatch = useAppDispatch();
  const transactions = useShallowEqualSelector(getTransactions);
  const participants = useSelector(getParticipants);
  const billId = useSelector(getBillId);
  const history = useSelector(getHistory);

  const [summaryState, setSummaryState] = useState<string | null>(null);

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

  const submitForm = (formData: FormData) => {
    console.log(JSON.stringify(formData));
    console.log(
      `submitted with ${formData.get("amount")} and ${formData.get("person")}`
    );
    setShowModal(false);
  };

  const [showModal, setShowModal] = useState(false);
  const modal = (
    <>
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <form action={submitForm}>
          <input name="amount" placeholder="amount" />
          <input name="person" placeholder="person" />
          <DialogActions>
            <button type="submit">Submit</button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );

  const displayTransaction = (billId: string) => {
    setSummaryState(billId);
  };

  const doneHandler = useCallback(() => {
    console.log("Saving bill state");
    dispatch(addToHistory());
    dispatch(clearBill());
    displayTransaction(billId);
  }, [dispatch, billId]);

  return (
    <>
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
      <br />
      <span>History size: {history.records.length}</span>
    </>
  );
}
