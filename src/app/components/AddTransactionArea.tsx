import {
  Button,
  FormHelperText,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { addTransaction, getParticipants } from "~/lib/features/core";
import { useAppDispatch } from "~/lib/hooks";
import AddPersonChipInput from "./AddPersonChipInput";
import { PersonChip } from "./PersonChip";
import { NumericFormat } from "react-number-format";

const MISSING_PARTICIPANTS_ERROR = "Must select at least one participant";

export default function AddTransactionArea() {
  const dispatch = useAppDispatch();
  const possibleParticipants = useSelector(getParticipants);

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [itemAmount, setItemAmount] = useState<string>("");
  const [error, setError] = useState<string | undefined>();

  const resetForm = () => {
    setSelectedParticipants([]);
    setError(undefined);
    setItemAmount("");
  };

  const submitFormHandler = () => {
    const amount = Number(itemAmount);
    if (isNaN(amount)) {
      setError("Amount must be a valid number");
      return;
    }
    if (amount === 0) {
      setError("Amount must be positive");
      return;
    }
    if (selectedParticipants.length === 0) {
      setError(MISSING_PARTICIPANTS_ERROR);
      return;
    }
    dispatch(
      addTransaction({
        amount: amount,
        participants: selectedParticipants.map((participant) => ({
          personId: participant,
          adjustPercentage: 1 / selectedParticipants.length,
        })),
      })
    );
    resetForm();
  };

  const setParticipantSelected = (participantId: string) => {
    if (error === MISSING_PARTICIPANTS_ERROR) setError(undefined);

    if (selectedParticipants.includes(participantId)) {
      setSelectedParticipants(
        selectedParticipants.filter((value) => value !== participantId)
      );
    } else {
      setSelectedParticipants([...selectedParticipants, participantId]);
    }
  };

  return (
    <>
      <NumericFormat
        customInput={TextField}
        name="itemAmount"
        placeholder="amount"
        size="small"
        inputMode="decimal"
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        valueIsNumericString
        decimalScale={2}
        allowNegative={false}
        value={itemAmount}
        onChange={(e) => setItemAmount(e.currentTarget.value)}
      />
      <Button type="submit" onClick={submitFormHandler}>
        Submit
      </Button>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {Object.values(possibleParticipants).map((participant) => (
          <PersonChip
            variant={
              selectedParticipants.includes(participant.id)
                ? "outlined"
                : "filled"
            }
            key={participant.id}
            label={participant.name}
            onClick={() => setParticipantSelected(participant.id)}
            id={participant.id}
          />
        ))}
        <AddPersonChipInput setParticipantSelected={setParticipantSelected} />
      </div>
      <FormHelperText error>{error}</FormHelperText>
    </>
  );
}
