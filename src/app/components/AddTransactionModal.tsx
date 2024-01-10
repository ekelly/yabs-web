import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  FormHelperText,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { addTransaction, getParticipants } from "~/lib/features/core";
import { useAppDispatch } from "~/lib/hooks";

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
    console.log(`submitted with ${formData.get("amount")}}`);
    if (selectedParticipants.length === 0) {
      setError(MISSING_PARTICIPANTS_ERROR);
      return;
    }
    const amount = Number(formData.get("amount"));
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

  const toggleParticipant = (participantId: string) => {
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
            <TextField name="amount" placeholder="amount" />
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
                onClick={() => {
                  toggleParticipant(participant.id);
                }}
              />
            ))}
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
