import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  FormHelperText,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { addTransaction, getParticipants } from "~/lib/features/core";
import { useAppDispatch } from "~/lib/hooks";
import AddPersonChipInput from "./AddPersonChipInput";
import { NumericFormat } from "react-number-format";

interface AddTransactionModalProps {
  showModal: boolean;
  closeAction: () => void;
}

const MISSING_PARTICIPANTS_ERROR = "Must select at least one participant";

export default function AddTransactionModal({
  showModal,
  closeAction,
}: AddTransactionModalProps) {
  const dispatch = useAppDispatch();
  const possibleParticipants = useSelector(getParticipants);

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [error, setError] = useState<string | undefined>();

  const closeForm = () => {
    setSelectedParticipants([]);
    setError(undefined);
    closeAction();
  };

  const submitFormHandler = (formData: FormData) => {
    console.log(JSON.stringify(formData));
    const amount = Number(formData.get("itemAmount"));
    if (isNaN(amount)) {
      setError("Amount must be a valid number");
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
    closeForm();
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
      <Dialog open={showModal} onClose={closeForm}>
        <form action={submitFormHandler}>
          <DialogContent>
            <NumericFormat
              customInput={TextField}
              name="itemAmount"
              placeholder="amount"
              inputMode="decimal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              valueIsNumericString
              decimalScale={2}
              allowNegative={false}
            />
            <br />
            {Object.values(possibleParticipants).map((participant) => (
              <Chip
                variant={
                  selectedParticipants.includes(participant.id)
                    ? "filled"
                    : "outlined"
                }
                key={participant.id}
                label={participant.name}
                onClick={() => setParticipantSelected(participant.id)}
              />
            ))}
            <AddPersonChipInput
              setParticipantSelected={setParticipantSelected}
            />
            <FormHelperText error>{error}</FormHelperText>
          </DialogContent>
          <DialogActions>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
