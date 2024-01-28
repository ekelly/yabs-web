import { Box, FormHelperText, InputAdornment, TextField } from "@mui/material";
import React, { useState, useRef } from "react";
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

  // Run validation checks
  const validate = (amount: number, selectedParticipants: string[]) => {
    if (isNaN(amount)) {
      setError("Amount must be a valid number");
      return false;
    }
    if (amount === 0) {
      setError("Amount must be positive");
      return false;
    }
    if (selectedParticipants.length === 0) {
      setError(MISSING_PARTICIPANTS_ERROR);
      return false;
    }
    return true;
  };

  // Return true on successful submission, false otherwise
  const submitFormHandler = (selectedParticipants: string[]): boolean => {
    const amount = Number(itemAmount);
    if (!validate(amount, selectedParticipants)) {
      return false;
    }
    const dedupedParticipants = new Set<string>();
    selectedParticipants.forEach((p) => dedupedParticipants.add(p));
    dispatch(
      addTransaction({
        amount: amount,
        participants: Array.from(dedupedParticipants).map((participant) => ({
          personId: participant,
          adjustPercentage: 1 / dedupedParticipants.size,
        })),
      })
    );
    resetForm();
    return true;
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
    if (!submitFormHandler([...selectedParticipants, participantId])) {
      // If the form did not submit, we want to make sure the
      // selected participants array is updated
      setParticipantSelected(participantId);
    }
  };

  const renderAmountInput = () => {
    return (
      <NumericFormat
        customInput={TextField}
        name="itemAmount"
        placeholder="amount"
        size="small"
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
          inputProps: {
            inputMode: "decimal",
          },
        }}
        valueIsNumericString
        decimalScale={2}
        allowNegative={false}
        value={itemAmount}
        onFocus={() => setMode(AddTransactionMode.ACTIVE)}
        onChange={(e) => setItemAmount(e.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            submitFormHandler(selectedParticipants);
          }
        }}
        inputRef={inputRef}
        autoComplete="off"
      />
    );
  };

  if (mode === AddTransactionMode.INACTIVE) {
    return (
      <Box
        sx={{
          paddingLeft: { sm: "16px" },
        }}
      >
        {renderAmountInput()}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        paddingLeft: { sm: "16px" },
      }}
    >
      {renderAmountInput()}
      <br />
      <Box
        sx={{
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
        <AddPersonChipInput setParticipantSelected={handleOnClick} />
      </Box>
      <FormHelperText error>{error}</FormHelperText>
    </Box>
  );
}
