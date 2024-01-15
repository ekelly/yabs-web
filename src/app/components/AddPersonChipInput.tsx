import {
  Chip,
  Input,
  TextField,
  TextFieldProps,
  styled,
  useTheme,
} from "@mui/material";
import { forwardRef, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { upsertPerson } from "~/lib/features/core";
import { useAppDispatch } from "~/lib/hooks";

// const InputChip = styled(TextField)<TextFieldProps<"standard">>(({ theme }) => {
//   console.log(theme);
//   return {
//     fontSize: theme.typography.body1,
//     // ...theme.components?.MuiChip?.defaultProps,
//   };
// });

export default function AddPersonChipInput({
  setParticipantSelected,
}: {
  setParticipantSelected: (participantId: string) => void;
}) {
  const dispatch = useAppDispatch();
  const theme = useTheme();

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
      <div
        style={{
          width: "200px",
          display: "inline-flex",
        }}
      >
        <Chip
          label={showNewParticipant ? "" : "+"}
          variant="filled"
          onClick={() => {
            setShowNewParticipant(true);
          }}
          className={showNewParticipant ? "BigChip" : "RegularChip"}
          sx={{
            marginTop: "2px",
            marginBottom: "2px",
            marginLeft: "1px",
            position: "absolute",
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
            onBlur={() => addParticipant()}
            sx={{
              position: "absolute",
              ...theme.typography.body2,
              fontSize: theme.typography.pxToRem(13),
              padding: "4px 11px",
              width: "200px",
            }}
          />
        )}
      </div>
    </>
  );
}
