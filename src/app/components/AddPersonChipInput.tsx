"use client";
import { Box, Chip, Input, useTheme } from "@mui/material";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { upsertPerson } from "~/lib/features/core";
import { useAppDispatch } from "~/lib/hooks";

interface AddPersonChipInputProps {
  setParticipantSelected: (participantId: string) => void;
}

/**
 * This component is an "input" type of "Chip" from material components.
 * It is used for adding a new person to the bill.
 */
export const AddPersonChipInput: React.FC<AddPersonChipInputProps> = ({
  setParticipantSelected,
}) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [showNewParticipant, setShowNewParticipant] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState<string>("");

  const resetChip = () => {
    setShowNewParticipant(false);
    setNewParticipantName("");
  };

  const addParticipant = () => {
    if (newParticipantName !== "") {
      const person = {
        id: uuidv4(),
        name: newParticipantName,
      };
      dispatch(upsertPerson(person));
      setParticipantSelected(person.id);
    }
    resetChip();
  };

  return (
    <Box
      sx={{
        width: "200px",
        display: "inline-flex",
      }}
    >
      <Chip
        label={showNewParticipant ? "" : "+"}
        variant="filled"
        onClick={() => setShowNewParticipant(true)}
        className={showNewParticipant ? "BigChip" : "RegularChip"}
        sx={{
          marginTop: "2px",
          marginBottom: "2px",
          marginLeft: "1px",
        }}
      />
      {showNewParticipant && (
        <Input
          autoFocus
          disableUnderline
          value={newParticipantName}
          onChange={(e) => setNewParticipantName(e.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              addParticipant();
            }
          }}
          onBlur={resetChip}
          sx={{
            position: "absolute",
            ...theme.typography.body2,
            fontSize: theme.typography.pxToRem(13),
            padding: "4px 11px",
            width: "200px",
          }}
        />
      )}
    </Box>
  );
};
