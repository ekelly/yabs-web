import { Button, Dialog, DialogActions, TextField } from "@mui/material";

interface AddTransactionModalProps {
  showModal: boolean;
  closeAction: () => void;
}

export default function AddTransactionModal({
  showModal,
  closeAction,
}: AddTransactionModalProps) {
  const submitForm = (formData: FormData) => {
    console.log(JSON.stringify(formData));
    console.log(
      `submitted with ${formData.get("amount")} and ${formData.get("person")}`
    );
    closeAction();
  };

  return (
    <>
      <Dialog open={showModal} onClose={closeAction}>
        <form action={submitForm}>
          <TextField name="amount" placeholder="amount" />
          <TextField name="person" placeholder="person" />
          <DialogActions>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
