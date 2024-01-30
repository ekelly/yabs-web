"use client";
import * as React from "react";
import type { RootState } from "~/lib/store";
import { getHistoricalBill } from "~/lib/features/history";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  Fab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { VenmoButton } from "./VenmoButton";
import { ShareButton } from "./ShareButton";
import { shareText } from "~/lib/features/api/share";
import ShareIcon from "@mui/icons-material/Share";
import { calculateBillShares } from "~/lib/features/core/billMath";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { TransactionListItem } from "~/app/components/TransactionListItem";
import { getDisplayableTransactions } from "~/lib/features/history/utils";
import { ErrorMessage } from "./ErrorMessage";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "~/lib/hooks";

const CANNOT_FIND_BILL_ERROR = "Error finding bill details";
const TOTAL_EXCEEDS_COST_ERROR = "Total bill split exceeds total cost";

interface SummaryViewProps {
  id?: string | null;
}

/**
 * This component is the "root" page for the summary view.
 * It provides a read-only view of a historical bill.
 */
export const SummaryView: React.FC<SummaryViewProps> = ({ id }) => {
  const [errorMessage, triggerError] = useState("");
  const billDetails = useAppSelector((state: RootState) => {
    return id ? getHistoricalBill(state, id) : null;
  });

  const displayableBill = useMemo(
    () => (billDetails ? calculateBillShares(billDetails) : null),
    [billDetails]
  );

  useEffect(() => {
    if (!displayableBill && id) {
      triggerError(CANNOT_FIND_BILL_ERROR);
    } else if (displayableBill?.totalSharesExceedsTotal) {
      triggerError(TOTAL_EXCEEDS_COST_ERROR);
    }
  }, [displayableBill, id, triggerError]);

  if (!id) {
    // TODO: This should display an error message (404?)
    return null;
  }

  const transactions = billDetails
    ? getDisplayableTransactions(billDetails)
    : null;
  const participants = billDetails?.participants;

  return (
    <>
      <ErrorMessage message={errorMessage} triggerError={triggerError} />
      <Container>
        <Typography variant="h5" component="div">
          {displayableBill?.description}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          ${displayableBill?.total}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
          {displayableBill ? (
            <Fab
              onClick={() => shareText(displayableBill)}
              sx={{
                position: { xs: "absolute", sm: "relative" },
                bottom: { xs: 16, sm: 40 },
                right: { xs: 16, sm: -75 },
              }}
            >
              <ShareIcon />
            </Fab>
          ) : null}
        </Box>
        <List sx={{ position: "relative", top: { sm: -40 } }}>
          {displayableBill?.participants
            ? Object.values(displayableBill?.participants).map((p) => {
                return (
                  <ListItem
                    disableGutters
                    divider
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      flexFlow: "row wrap",
                      justifyContent: "flex-end",
                    }}
                    key={p.id}
                  >
                    <Typography
                      component="span"
                      sx={{ flex: "1 auto", flexGrow: 2 }}
                    >
                      {p.name}:{" "}
                    </Typography>
                    <Box
                      sx={{
                        order: { sm: 2, xs: 3 },
                        flex: { xs: "1 100%", sm: "1 auto" },
                        textAlign: { xs: "left", sm: "right" },
                      }}
                    >
                      <Typography component="span" color="text.secondary">
                        (${p.share})
                      </Typography>
                      <Typography component="span" sx={{ marginLeft: 2 }}>
                        ${p.total}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        marginLeft: "4px",
                        order: { xs: 2, sm: 3 },
                        minWidth: "fit-content",
                      }}
                    >
                      <ShareButton
                        sx={{ mr: "10px" }}
                        billData={displayableBill}
                        id={p.id}
                      />
                      <VenmoButton amount={p.total} description={p.name} />
                    </Box>
                  </ListItem>
                );
              })
            : null}
        </List>
        {transactions && participants ? (
          <>
            <br />
            <br />
            <Accordion>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography>Transactions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {transactions.map((item) => {
                    return (
                      <TransactionListItem
                        key={item.id}
                        item={item}
                        editable={false}
                        billParticipants={participants}
                      />
                    );
                  })}
                </List>
              </AccordionDetails>
            </Accordion>
          </>
        ) : null}
      </Container>
    </>
  );
};
