import * as React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "~/lib/store";
import { getHistoricalBill } from "~/lib/features/history";
import { Snackbar, Alert, Container, Typography } from "@mui/material";
import VenmoButton from "./VenmoButton";

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

    console.log(billDetails);

    return (
        <>
            <ErrorMessage open={open} triggerError={triggerError} />
            <Container>
                <Typography variant="h5" component="div">
                    {billDetails?.description}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    ${billDetails?.total}
                </Typography>
                {billDetails?.participants ? Object.values(billDetails?.participants).map((p) => {
                    const share = 100;
                    return <div key={p.id}>
                        <Typography variant="body2">{p.name}: ${p.share ?? 100}</Typography>
                        {share ? <VenmoButton amount={share} description={p.name} /> : null }
                    </div>;
                }) : null}
            </Container>
        </>
    );
}
