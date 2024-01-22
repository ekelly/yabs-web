"use client";
import {
  Zoom,
  FormHelperText,
  Box,
  Fab,
  useTheme,
  Slide,
  Paper,
  Typography,
} from "@mui/material";
import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  getTransactions,
  clearBill,
  getBillState,
  removePerson,
} from "~/lib/features/core";
import { addToHistory } from "~/lib/features/history";
import { useAppDispatch, useShallowEqualSelector } from "~/lib/hooks";
import BillInfo from "./BillInfo";
import TransactionList from "./TransactionList";
import { useRouter } from "next/navigation";
import AddTransactionArea from "./AddTransactionAreaV2";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { PersonChip } from "./PersonChip";
import { calculatePersonTotals } from "~/lib/features/core/billMath";

export default function BillEntry() {
  const dispatch = useAppDispatch();
  const transactions = useShallowEqualSelector(getTransactions);
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
        <Fab
          onClick={doneHandler}
          sx={{
            position: { xs: "absolute", sm: "relative" },
            bottom: { xs: 16, sm: 20 },
            right: { xs: 16, sm: -500 },
          }}
        >
          <SaveIcon />
        </Fab>
      </Zoom>
      <Box
        sx={{
          top: { sm: transactions.length > 0 ? -40 : 0 },
          position: "relative",
        }}
      >
        <TransactionList items={transactions} participants={participants} />
        <AddTransactionArea />
      </Box>
      {transactions.length ? <hr /> : null}
      <FormHelperText error>{error}</FormHelperText>
      <Slide
        direction="up"
        in={transactions.length > 0}
        mountOnEnter
        unmountOnExit
      >
        <Paper
          sx={{
            m: 1,
            width: "95%",
            height: "auto",
            padding: "10px",
          }}
          elevation={1}
        >
          <Box sx={{ display: "flex" }}>
            <Box sx={{ flexGrow: 2 }}>
              <Typography variant="body1">Subtotal:</Typography>
            </Box>
            <Box sx={{ flexGrow: 1, textAlign: "end" }}>
              <Typography variant="body1">
                ${transactions.reduce((acc, t) => acc + t.amount, 0).toFixed(2)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ marginTop: "10px" }}>
            {Object.values(billState.participants).map((participant) => {
              console.log(`${JSON.stringify(personTotals)}`);
              const share = personTotals[participant.id].total;
              return (
                <PersonChip
                  variant="filled"
                  key={participant.id}
                  label={`${participant.name}: ${share ?? 0}`}
                  deleteIcon={<DeleteIcon />}
                  onDelete={() => dispatch(removePerson(participant.id))}
                  id={participant.id}
                />
              );
            })}
          </Box>
        </Paper>
      </Slide>
    </>
  );
}
