import { useSelector } from "react-redux";
import {
  getBillDescription,
  getBillTotal,
  setBillDescription,
  setBillTotal,
} from "~/lib/features/core";
import { useAppDispatch } from "~/lib/hooks";
import { ChangeEvent, useCallback } from "react";
import { TextField, Paper } from "@mui/material";
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';

export default function BillInfo() {
  const dispatch = useAppDispatch();

  const billDescription = useSelector(getBillDescription);
  const billTotal = useSelector(getBillTotal);

  const updateBillNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setBillDescription(e.currentTarget.value));
  };

  const updateBillTotalHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setBillTotal(Number(e.currentTarget.value)));
  };

  return (
    <>
      <Paper component="form"
          elevation={4}
          sx={{ p: '2px 4px', display: 'flex', marginTop: "5px", alignItems: 'center', width: "95%", marginLeft: "auto", marginRight: "auto" }}>
        <TextField
          placeholder="Bill Name"
          value={billDescription}
          onChange={updateBillNameHandler}
          sx={{ width: "inherit" }}
        />
        <span style={{ marginLeft: "5px" }}>$</span>
        <TextField
          type="tel"
          placeholder="Bill Total"
          value={billTotal ?? ""}
          onChange={updateBillTotalHandler}
        />
      </Paper>
    </>
  );
}
