"use client";
import { Box, FormHelperText } from "@mui/material";
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { addTransaction, getParticipants } from "~/lib/features/core";
import { useAppDispatch } from "~/lib/hooks";
import { AddPersonChipInput } from "./AddPersonChipInput";
import { PersonChip } from "./PersonChip";
import { NumericInput } from "./NumericInput";

// Constants and types
const MISSING_PARTICIPANTS_ERROR = "Must select at least one participant";
const INVALID_NUMBER_ERROR = "Amount must be a valid number";
const NEGATIVE_NUMBER_ERROR = "Amount must be positive";

enum AddTransactionMode {
  INACTIVE,
  ACTIVE,
}

export const AddTransactionArea = () => {
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

  const updateItemAmount = (strAmount: string) => {
    const hasNumericError =
      error === INVALID_NUMBER_ERROR || error === NEGATIVE_NUMBER_ERROR;
    if (hasNumericError) {
      if (numericValidation(Number(strAmount))) {
        setError(undefined);
      }
    }
    setItemAmount(strAmount);
  };

  // Run numeric-specific validation
  const numericValidation = (amount: number): boolean => {
    if (isNaN(amount)) {
      setError(INVALID_NUMBER_ERROR);
      return false;
    }
    if (amount <= 0) {
      setError(NEGATIVE_NUMBER_ERROR);
      return false;
    }
    return true;
  };

  // Run all validation checks
  const validate = (amount: number, selectedParticipants: string[]) => {
    if (!numericValidation(amount)) {
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
    if (error === MISSING_PARTICIPANTS_ERROR) {
      setError(undefined);
    }

    // If the participant was previously part of the transaction, remove them
    if (selectedParticipants.includes(participantId)) {
      setSelectedParticipants(
        selectedParticipants.filter((value) => value !== participantId)
      );
    } else {
      // Set the participant to be part of the transaction
      setSelectedParticipants([...selectedParticipants, participantId]);
    }
  };

  const handleOnClick = (participantId: string) => {
    // When a participant is selected, try to submit the form
    if (!submitFormHandler([...selectedParticipants, participantId])) {
      // If the form did not submit, we want to make sure the
      // selected participants array is updated
      setParticipantSelected(participantId);
    }
  };

  const AmountInput = (
    <NumericInput
      itemAmount={itemAmount}
      onFocus={() => setMode(AddTransactionMode.ACTIVE)}
      onChange={(e) => updateItemAmount(e.currentTarget.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          submitFormHandler(selectedParticipants);
        }
      }}
      inputRef={inputRef}
    />
  );

  const Wrapper = (props: { children: React.ReactNode }) => {
    return (
      <Box
        sx={{
          paddingLeft: { sm: "16px" },
        }}
      >
        {props.children}
      </Box>
    );
  };

  if (mode === AddTransactionMode.INACTIVE) {
    return <Wrapper>{AmountInput}</Wrapper>;
  }

  return (
    <Wrapper>
      {AmountInput}
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
    </Wrapper>
  );
};
