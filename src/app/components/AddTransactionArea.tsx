import { Chip, FormHelperText, InputAdornment, TextField } from "@mui/material";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { addTransaction, getParticipants } from "~/lib/features/core";
import { useAppDispatch } from "~/lib/hooks";
import AddPersonChipInput from "./AddPersonChipInput";
import { PersonChip } from "./PersonChip";
import { NumericFormat } from "react-number-format";

const MISSING_PARTICIPANTS_ERROR = "Must select at least one participant";

enum AddTransactionMode {
  INACTIVE,
  ACTIVE,
  EXPANDED,
}

export default function AddTransactionArea() {
  const dispatch = useAppDispatch();
  const possibleParticipants = useSelector(getParticipants);

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [itemAmount, setItemAmount] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const [mode, setMode] = useState(AddTransactionMode.INACTIVE);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setSelectedParticipants([]);
    setError(undefined);
    setItemAmount("");

    // Set the focus back to inputting new transaction amounts
    inputRef.current?.focus();
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

  const handleOnClick = (participantId: string) => {
    setParticipantSelected(participantId);
    submitFormHandler();
  };

  const renderAmountInput = () => {
    return (
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
        onFocus={() => setMode(AddTransactionMode.ACTIVE)}
        onChange={(e) => setItemAmount(e.currentTarget.value)}
        inputRef={inputRef}
      />
    );
  };

  if (mode === AddTransactionMode.INACTIVE) {
    return renderAmountInput();
  }

  return (
    <>
      {renderAmountInput()}
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
            onClick={() => handleOnClick(participant.id)}
            id={participant.id}
          />
        ))}
        <AddPersonChipInput setParticipantSelected={setParticipantSelected} />
        <Chip
          label={mode === AddTransactionMode.EXPANDED ? "👥" : "👤"}
          variant="filled"
          onClick={() =>
            setMode(
              mode === AddTransactionMode.EXPANDED
                ? AddTransactionMode.ACTIVE
                : AddTransactionMode.EXPANDED
            )
          }
          sx={{
            marginTop: "2px",
            marginBottom: "2px",
            marginLeft: "1px",
            position: "relative",
          }}
        />
      </div>
      <FormHelperText error>{error}</FormHelperText>
    </>
  );
}
