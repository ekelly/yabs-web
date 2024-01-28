import { useSelector } from "react-redux";
import {
  getBillDescription,
  getBillTotal,
  setBillDescription,
  setBillTotal,
} from "~/lib/features/core";
import { useAppDispatch } from "~/lib/hooks";
import { ChangeEvent, useEffect, useState } from "react";
import { TextField, Paper, InputAdornment } from "@mui/material";
import { NumericFormat } from "react-number-format";

export default function BillInfo() {
  const dispatch = useAppDispatch();

  const billDescription = useSelector(getBillDescription);
  const billTotal = useSelector(getBillTotal);

  const [total, setTotal] = useState<string>(billTotal?.toString() ?? "");
  useEffect(() => {
    if (!billTotal) setTotal("");
  }, [billTotal, setTotal]);

  const updateBillNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setBillDescription(e.currentTarget.value));
  };

  const updateBillTotal = () => {
    setTotal(Number(total).toFixed(2));
    dispatch(setBillTotal(Number(total)));
  };

  return (
    <>
      <Paper
        component="form"
        elevation={4}
        sx={{
          p: "2px 4px",
          display: "flex",
          marginTop: "5px",
          alignItems: "center",
          width: { xs: "100%", sm: "95%" },
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <TextField
          placeholder="Bill Description"
          value={billDescription}
          onChange={updateBillNameHandler}
          sx={{ width: "inherit" }}
        />
        <NumericFormat
          customInput={TextField}
          placeholder="Bill Total"
          value={total}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: {
              inputMode: "decimal",
            },
          }}
          onChange={(e) => setTotal(e.target.value)}
          onBlur={updateBillTotal}
          valueIsNumericString
          decimalScale={2}
          allowNegative={false}
          autoComplete="off"
        />
      </Paper>
    </>
  );
}
