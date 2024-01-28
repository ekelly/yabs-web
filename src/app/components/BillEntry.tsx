"use client";
import { Zoom, Box, Fab, useTheme } from "@mui/material";
import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { getTransactions, clearBill, getBillState } from "~/lib/features/core";
import { addToHistory } from "~/lib/features/history";
import { useAppDispatch } from "~/lib/hooks";
import BillInfo from "./BillInfo";
import TransactionList from "./TransactionList";
import { useRouter } from "next/navigation";
import AddTransactionArea from "./AddTransactionAreaV2";
import SaveIcon from "@mui/icons-material/Save";
import { calculatePersonTotals } from "~/lib/features/core/billMath";
import SubtotalView from "./SubtotalView";
import { ErrorMessage } from "./ErrorMessage";

export default function BillEntry() {
  const dispatch = useAppDispatch();
  const transactions = useSelector(getTransactions);
  const billState = useSelector(getBillState);
  const theme = useTheme();
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
  }, [description, total, transactions, dispatch, router, id]);

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  return (
    <>
      <BillInfo />
      <Zoom
        key={"save"}
        in={transactions.length > 0}
        timeout={transitionDuration}
        style={{
          transitionDelay: `${
            transactions.length > 0 ? transitionDuration.exit : 0
          }ms`,
        }}
        unmountOnExit
      >
        <Box
          sx={{
            position: { xs: "fixed", sm: "relative" },
            bottom: { xs: 16, sm: 20 },
            right: { xs: 16, sm: -500 },
          }}
        >
          <Fab
            onClick={doneHandler}
            sx={{
              position: { sm: "fixed" },
              top: { sm: 150 },
            }}
          >
            <SaveIcon />
          </Fab>
        </Box>
      </Zoom>
      <TransactionList items={transactions} participants={participants} />
      <AddTransactionArea />
      {transactions.length ? <hr /> : null}
      <ErrorMessage message={error} triggerError={setError} />
      <SubtotalView
        transactions={transactions}
        participants={billState.participants}
        personTotals={personTotals}
      />
    </>
  );
}
