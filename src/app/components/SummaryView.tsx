import * as React from "react";
import { useSelector } from "react-redux";
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
import VenmoButton from "./VenmoButton";
import ShareButton from "./ShareButton";
import { shareText } from "~/lib/features/api/share";
import ShareIcon from "@mui/icons-material/Share";
import { calculateBillShares } from "~/lib/features/core/billMath";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TransactionListItem from "~/app/components/TransactionListItemV2";
import { getDisplayableTransactions } from "~/lib/features/history/utils";
import { ErrorMessage } from "./ErrorMessage";
import { useMemo } from "react";

interface SummaryViewProps {
  id?: string | null;
}

export default function SummaryView({ id }: SummaryViewProps) {
  const [errorMessage, triggerError] = React.useState("");
  const billDetails = useSelector((state: RootState) => {
    return id ? getHistoricalBill(state, id) : null;
  });

  const displayableBill = useMemo(
    () => (billDetails ? calculateBillShares(billDetails) : null),
    [billDetails]
  );

  React.useEffect(() => {
    if (!displayableBill && id) {
      triggerError("Error finding bill details");
    } else if (displayableBill?.totalSharesExceedsTotal) {
      triggerError("Total bill split exceeds total cost");
    }
  }, [displayableBill, id, triggerError]);

  if (!id) {
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
}
