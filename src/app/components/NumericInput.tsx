import { TextField, InputAdornment } from "@mui/material";
import * as React from "react";
import { Ref } from "react";
import { NumericFormat } from "react-number-format";

type NumericInputProps = {
  itemAmount: string;
  onFocus?: () => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: Ref<HTMLInputElement>;
};

export const NumericInput: React.FC<NumericInputProps> = ({
  itemAmount,
  onFocus,
  onChange,
  onKeyDown,
  inputRef,
}) => {
  return (
    <NumericFormat
      customInput={TextField}
      name="itemAmount"
      placeholder="amount"
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
      onFocus={onFocus}
      onChange={onChange}
      onKeyDown={onKeyDown}
      inputRef={inputRef}
      autoComplete="off"
    />
  );
};
