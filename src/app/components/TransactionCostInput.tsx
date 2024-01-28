import { TextField, InputAdornment, FormHelperText } from "@mui/material";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import { updateTransactionAmount } from "~/lib/features/core";
import { useAppDispatch } from "~/lib/hooks";

type TransactionCostInputProps = {
  transactionId: string;
  initialAmount?: string;
  // Return an error message to prevent the submission
  onBeforeSubmit?: () => string | undefined;
  onBlur?: () => void;
};
interface TransactionCostInputRef {
  resetForm: () => void;
  setErrorMessage: (message: string) => void;
}

export const TransactionCostInput = forwardRef<
  TransactionCostInputRef,
  TransactionCostInputProps
>((props, forwardRef) => {
  const { transactionId, initialAmount, onBlur, onBeforeSubmit } = props;
  const dispatch = useAppDispatch();

  const [itemAmount, setItemAmount] = useState<string | undefined>(
    initialAmount
  );
  const [error, setError] = useState<string | undefined>();
  const inputRef = useRef(null);

  const resetForm = () => {
    setError(undefined);
    setItemAmount("");
  };

  const setErrorMessage = (message?: string) => {
    setError(message);
  };

  useImperativeHandle(forwardRef, () => {
    return {
      resetForm,
      setErrorMessage,
    };
  });

  const submitFormHandler = () => {
    const amount = Number(itemAmount);
    if (isNaN(amount)) {
      setError("Amount must be a valid number");
      return;
    }
    if (amount === 0) {
      setError("Amount must be positive");
      return;
    }
    dispatch(updateTransactionAmount({ amount, transactionId }));
    resetForm();
  };

  const handleOnBlur = () => {
    let errorMessage: string | undefined = "";
    if (onBeforeSubmit) {
      errorMessage = onBeforeSubmit();
    }
    if (!errorMessage) {
      submitFormHandler();
    } else {
      setError(errorMessage);
    }

    if (onBlur) {
      onBlur();
    }
  };

  return (
    <>
      <NumericFormat
        customInput={TextField}
        name="itemAmount"
        placeholder={initialAmount}
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
        onBlur={handleOnBlur}
        onChange={(e) => setItemAmount(e.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleOnBlur();
          }
        }}
        inputRef={inputRef}
      />
      <FormHelperText error>{error}</FormHelperText>
    </>
  );
});
TransactionCostInput.displayName = "TransactionCostInput";
