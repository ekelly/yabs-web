import { Chip } from "@mui/material";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { upsertPerson } from "~/lib/features/core";
import { useAppDispatch } from "~/lib/hooks";

export default function AddPersonChipInput({
  setParticipantSelected,
}: {
  setParticipantSelected: (participantId: string) => void;
}) {
  const dispatch = useAppDispatch();

  const [showNewParticipant, setShowNewParticipant] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState<string>("");

  const addParticipant = () => {
    if (newParticipantName !== "") {
      const person = {
        id: uuidv4(),
        name: newParticipantName,
      };
      console.log(`adding ${JSON.stringify(person)}`);
      dispatch(upsertPerson(person));
      setParticipantSelected(person.id);
    }
    setShowNewParticipant(false);
    setNewParticipantName("");
  };

  return (
    <>
      <Chip
        label="+"
        variant="outlined"
        onClick={() => {
          setShowNewParticipant(true);
        }}
      />
      <input
        hidden={!showNewParticipant}
        value={newParticipantName}
        onChange={(e) => setNewParticipantName(e.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            addParticipant();
          }
        }}
        onBlur={() => addParticipant()}
      />
    </>
  );
}
