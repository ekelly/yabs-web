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
} from "~/lib/features/core";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import BillInfo from "./components/BillInfo";
import { useShallowEqualSelector } from "~/lib/hooks";
import TransactionList from "./components/TransactionList";

export default function Page() {
  const dispatch = useAppDispatch();
  const transactions = useShallowEqualSelector(getTransactions);
  const participants = useSelector(getParticipants);

  const addPersonHandler = useCallback(() => {
    dispatch(addPerson("New Person"));
  }, [dispatch]);

  const addTransactionHandler = useCallback(() => {
    const numPeople = Math.floor(Math.random() * (Object.entries(participants).length - 1) + 1);
    const involved = Array.from(Object.entries(participants)).slice(0, numPeople);
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
      <br />
      <br />
      <br />
      <TransactionList items={transactions} />




      <FilledButton>button text</FilledButton>
      <Fab onClick={addPersonHandler} label="+" />
      <Fab onClick={addTransactionHandler} label="transaction" />
      <ChipSet>
        <InputChip label="chip 1"></InputChip>
        <InputChip label="chip 2"></InputChip>
      </ChipSet>
    </>
  );
}
