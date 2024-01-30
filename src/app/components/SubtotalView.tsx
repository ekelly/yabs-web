"use client";
import { Slide, Paper, Box, Typography } from "@mui/material";
import * as React from "react";
import {
  IBillState,
  IDisplayableTransaction,
  removePerson,
} from "~/lib/features/core";
import { PersonChip } from "./PersonChip";
import { useAppDispatch } from "~/lib/hooks";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { IPersonTotals } from "~/lib/features/core/billMath";
import { useState } from "react";

type SubtotalViewProps = {
  transactions: IDisplayableTransaction[];
  participants: IBillState["participants"];
  personTotals: IPersonTotals;
};

/**
 * This component provides the subtotal of all the transactions,
 * and allows for the deletion of participants.
 */
export const SubtotalView: React.FC<SubtotalViewProps> = ({
  transactions,
  participants,
  personTotals,
}) => {
  const dispatch = useAppDispatch();

  // Whether or not the participants can be edited
  const [editMode, setEditMode] = useState(false);

  const clickHandler = () => {
    setEditMode(!editMode);
  };

  return (
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
          marginBottom: { xs: "60px" }, // Needed to provide room for the save button
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
          {Object.values(participants).map((participant) => {
            console.log(`${JSON.stringify(personTotals)}`);
            const share = personTotals[participant.id].total;
            return (
              <PersonChip
                variant="outlined"
                key={participant.id}
                label={`${participant.name}: $${share ?? 0}`}
                deleteIcon={editMode ? <DeleteIcon /> : undefined}
                onDelete={
                  editMode
                    ? () => dispatch(removePerson(participant.id))
                    : undefined
                }
                id={participant.id}
              />
            );
          })}
          <PersonChip
            variant="filled"
            key="edit"
            label={
              editMode ? (
                <CheckIcon fontSize="small" />
              ) : (
                <EditIcon fontSize="small" />
              )
            }
            onClick={clickHandler}
            id="edit"
            colorOverrides={{ background: "#cdcdcd", hover: "#b4b4b4" }}
          />
        </Box>
      </Paper>
    </Slide>
  );
};
