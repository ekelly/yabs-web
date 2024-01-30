"use client";
import { FormHelperText } from "@mui/material";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { updateTransactionAmount } from "~/lib/features/core";
import { useAppDispatch } from "~/lib/hooks";
import { NumericInput } from "./NumericInput";

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

/**
 * This component allows editing individual transaction
 * amounts.
 */
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
      <NumericInput
        itemAmount={itemAmount}
        onBlur={handleOnBlur}
        onChange={(e) => setItemAmount(e.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleOnBlur();
          }
        }}
        inputRef={inputRef}
        placeholder={initialAmount}
      />
      <FormHelperText error>{error}</FormHelperText>
    </>
  );
});
TransactionCostInput.displayName = "TransactionCostInput";
