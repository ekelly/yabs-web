import { Button, Chip, Dialog, DialogActions, TextField } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getParticipants } from "~/lib/features/core";

interface AddTransactionModalProps {
  showModal: boolean;
  closeAction: () => void;
}

export default function AddTransactionModal({
  showModal,
  closeAction,
}: AddTransactionModalProps) {
  const possibleParticipants = useSelector(getParticipants);
  // const [selectedParticipants, setSelectedParticipants] = useState(new Set());

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );

  const closeForm = () => {
    setSelectedParticipants([]);
    closeAction();
  };
  const submitForm = (formData: FormData) => {
    console.log(JSON.stringify(formData));
    console.log(
      `submitted with ${formData.get("amount")} and ${formData.get("person")}`
    );
    closeForm();
  };

  const toggleParticipant = (participantId: string) => {
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
        <form action={submitForm}>
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
          <TextField name="person" placeholder="person" />
          <DialogActions>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
