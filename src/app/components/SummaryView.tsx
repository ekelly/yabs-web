import * as React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "~/lib/store";
import { getHistoricalBill } from "~/lib/features/history";
import { Snackbar, Alert, Box, Container, Typography, List, ListItem, Fab } from "@mui/material";
import VenmoButton from "./VenmoButton";
import ShareButton from "./ShareButton";
import { NativeShareComponent, shareToNative } from "~/lib/features/api/share";
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
                        { displayableBill ? 
                    <Fab
                        onClick={() => shareToNative(displayableBill)}
                        sx={{ position: { xs: "absolute", sm: "relative" }, bottom: { xs: 16, sm: 40 }, right: { xs: 16, sm: -75 } }}
                    >
                        <ShareIcon />
                    </Fab>
                    : null}
                    </div>
                </NativeShareComponent>
                <List sx={{ bottom: { xs: 0, sm: 40 } }}>
                {displayableBill?.participants ? Object.values(displayableBill?.participants).map((p) => {
                    return <ListItem disableGutters divider sx={{ display: "flex", flexDirection: "row", flexFlow: "row wrap", justifyContent: "flex-end" }} key={p.id}>
                        <Typography component="span" sx={{ flex: "1 auto", flexGrow: 2 }}>{p.name}: </Typography>
                        <Box sx={{ order: {sm: 2, xs: 3 }, flex: { xs: "1 100%", sm: "1 auto" }}}>
                        <Typography component="span" color="text.secondary">(${p.share})</Typography>
                        <Typography component="span" sx={{ marginLeft: 2}}>${p.total}</Typography>
                        </Box>
                        <Box sx={{ marginLeft: 4, minWidth: 115, order: { xs: 2, sm: 3 }, flex: "1 0px" }}>
                        {p.share ? <ShareButton sx={{ mr: "10px" }} billData={displayableBill} id={p.id} /> : null}
                        {p.share ? <VenmoButton amount={p.total} description={p.name} /> : <span>No venmo</span> }
                        </Box>
                    </ListItem>;
                }) : null}
                </List>
                
            </Container>
        </>
    );
}
