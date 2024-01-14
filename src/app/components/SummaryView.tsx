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
    open: boolean,
    triggerError: (show: boolean) => void
}) => {
    const { open, triggerError } = props;
    const handleClose = React.useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }

        triggerError(false);
    }, [triggerError]);

    return <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="Error finding bill details"
        sx={{ bottom: { xs: 90, sm: 0 } }}
    >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            Error finding bill details
        </Alert>
    </Snackbar>;
}

export default function SummaryView({ id }: SummaryViewProps) {
    const [open, triggerError] = React.useState(false);
    const billDetails = useSelector((state: RootState) => {
        return id ? getHistoricalBill(state, id) : null;
    });

    React.useEffect(() => {
        if (!billDetails && id) {
            triggerError(true);
        }
    }, [billDetails, id, triggerError]);

    if (!id) {
        return null;
    }

    const displayableBill = billDetails ? calculateBillShares(billDetails) : null;
    console.log(displayableBill);

    return (
        <>
            <ErrorMessage open={open} triggerError={triggerError} />
            <Container>
                <Typography variant="h5" component="div">
                    {displayableBill?.description}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    ${displayableBill?.total}
                </Typography>
                <List>
                {displayableBill?.participants ? Object.values(displayableBill?.participants).map((p) => {
                    const share = 100;
                    return <ListItem divider sx={{ display: "flex", justifyContent: "space-between" }} key={p.id}>
                        <Typography component="span">{p.name}: ${p.share ?? 100}</Typography>
                        <Box sx={{ alignSelf: "flex-end" }}>
                        {share ? <ShareButton sx={{ mr: "10px" }} title={p.name} description={`You owe $${share}`} /> : null}
                        {share ? <VenmoButton amount={share} description={p.name} /> : <span>No venmo</span> }
                        </Box>
                    </ListItem>;
                }) : null}
                </List>
                <NativeShareComponent>
                    <Fab
                        onClick={() => nativeShare("title", "description")}
                        sx={{ position: "absolute", bottom: "16px", right: "16px" }}
                    >
                        <ShareIcon />
                    </Fab>
                </NativeShareComponent>
            </Container>
        </>
    );
}
