"use client";

import { Fab } from "./ui/Fab";
import { FilledButton } from "./ui/FilledButton";
import { ChipSet } from "./ui/ChipSet";
import { InputChip } from "./ui/InputChip";
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
import { Dialog } from "./ui/Dialog";
import { addToHistory } from "~/lib/features/history";
import SummaryView from "~/app/components/SummaryView";

export default function Page() {
  const dispatch = useAppDispatch();
  const transactions = useShallowEqualSelector(getTransactions);
  const participants = useSelector(getParticipants);
  const billId = useSelector(getBillId);
  
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
  };

  const [showModal, setShowModal] = useState(false);
  const modal = (
    <>
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <form slot="content" action={submitForm}>
          <input name="amount" placeholder="amount" />
          <input name="person" placeholder="person" />
          <button type="submit">Submit</button>
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
      {modal}
      <br />
      <br />
      <br />
      <TransactionList items={transactions} />

      <FilledButton>button text</FilledButton>
      <Fab onClick={addPersonHandler} label="+" />
      <Fab onClick={addTransactionHandler} label="transaction" />
      <Fab onClick={() => setShowModal(true)} label="transaction modal" />
      <Fab onClick={doneHandler} label="done" />
      <ChipSet>
        <InputChip label="chip 1"></InputChip>
        <InputChip label="chip 2"></InputChip>
      </ChipSet>

      { summaryState !== null ? <SummaryView id={summaryState} /> : null}
    </>
  );
}
