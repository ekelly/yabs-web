"use client";
import { TextField, InputAdornment } from "@mui/material";
import * as React from "react";
import { Ref } from "react";
import { NumericFormat } from "react-number-format";

type NumericInputProps = {
  itemAmount: string | undefined;
  onFocus?: () => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  inputRef?: Ref<HTMLInputElement>;
  placeholder?: string;
};

/**
 * This component is an input field which only allows numeric imputs
 */
export const NumericInput: React.FC<NumericInputProps> = ({
  itemAmount,
  onFocus,
  onBlur,
  onChange,
  onKeyDown,
  placeholder,
  inputRef,
}) => {
  return (
    <NumericFormat
      customInput={TextField}
      name="itemAmount"
      placeholder={placeholder ?? "amount"}
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
      onBlur={onBlur}
      onChange={onChange}
      onKeyDown={onKeyDown}
      inputRef={inputRef}
      autoComplete="off"
    />
  );
};
