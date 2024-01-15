import * as React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "~/lib/store";
import { getHistoricalBill } from "~/lib/features/history";
import { Snackbar, Alert, Box, Container, Typography, List, ListItem, Fab } from "@mui/material";
import VenmoButton from "./VenmoButton";
import ShareButton from "./ShareButton";
import { NativeShareComponent, nativeShare } from "~/lib/features/api/share";
import ShareIcon from '@mui/icons-material/Share';
import { calculateBillShares } from "~/lib/features/core/billMath";

interface SummaryViewProps {
    id?: string | null;
}

const ErrorMessage = (props: {
    message: string,
    triggerError: (show: string) => void
}) => {
    const { message, triggerError } = props;
    const handleClose = React.useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }

        triggerError("");
    }, [triggerError]);

    return <Snackbar
        open={!!message}
        autoHideDuration={5000}
        onClose={handleClose}
        message={message}
        sx={{ bottom: { xs: 90, sm: 0 } }}
    >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {message}
        </Alert>
    </Snackbar>;
}

export default function SummaryView({ id }: SummaryViewProps) {
    const [errorMessage, triggerError] = React.useState("");
    const billDetails = useSelector((state: RootState) => {
        return id ? getHistoricalBill(state, id) : null;
    });

    const displayableBill = billDetails ? calculateBillShares(billDetails) : null;

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
                <NativeShareComponent>
                    <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                    <Fab
                        onClick={() => nativeShare("title", "description")}
                        sx={{ position: { xs: "absolute", sm: "relative" }, bottom: { xs: 16, sm: 40 }, right: { xs: 16, sm: -75 } }}
                    >
                        <ShareIcon />
                    </Fab>
                    </div>
                </NativeShareComponent>
                <List sx={{ bottom: { xs: 0, sm: 40 } }}>
                {displayableBill?.participants ? Object.values(displayableBill?.participants).map((p) => {
                    return <ListItem divider sx={{ display: "flex", flexDirection: "row" }} key={p.id}>
                        <Typography component="span" sx={{ flexGrow: 3 }}>{p.name}: </Typography>
                        <div>
                        <Typography component="span" color="text.secondary">(${p.share})</Typography>
                        <Typography component="span" sx={{ marginLeft: 2}}>${p.total}</Typography>
                        </div>
                        <Box sx={{ alignSelf: "flex-end", marginLeft: 4 }}>
                        {p.share ? <ShareButton sx={{ mr: "10px" }} title={p.name} description={`You owe $${p.total}`} /> : null}
                        {p.share ? <VenmoButton amount={p.total} description={p.name} /> : <span>No venmo</span> }
                        </Box>
                    </ListItem>;
                }) : null}
                </List>
                
            </Container>
        </>
    );
}
