import * as React from "react";
import { useSelector } from "react-redux";
import { getHistory, removeFromHistory } from "~/lib/features/history";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
  IconButton,
  CardActionArea,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Typography } from "@mui/material";
import SwipeableList from "material-swipeable-list";
import { useAppDispatch } from "~/lib/hooks";
import { isTouchEnabled } from "~/lib/utils";
import NextLink from "next/link";
import type { IDisplayableHistoricalBill } from "~/lib/features/history/selectors";
import { shareText } from "~/lib/features/api/share";
import { useState } from "react";

interface HistoryCardProps {
  historyItem: IDisplayableHistoricalBill;
  triggerInfoPopup: () => void;
}

const HistoryCard = (props: HistoryCardProps) => {
  const { historyItem, triggerInfoPopup } = props;
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    dispatch(removeFromHistory(historyItem.id));
  };

  const handleShare = () => {
    shareText(historyItem, historyItem.id);
    triggerInfoPopup();
  };

  return (
    <Card
      key={historyItem.id}
      sx={{
        maxWidth: "98%",
        marginLeft: "5px",
        marginRight: "5px",
        display: "block",
        margin: "auto",
        marginBottom: "5px",
      }}
      variant="outlined"
    >
      <CardActionArea>
        <Link
          href={`/summary?billId=${historyItem.id}`}
          component={NextLink}
          sx={{
            all: "unset",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              {historyItem.description}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              ${historyItem.total}
            </Typography>
            <Typography variant="body2">
              {...Object.values(historyItem.participants).map((p) => {
                return (
                  <>
                    <span>
                      {p.name}: ${p.share}
                    </span>
                    <br />
                  </>
                );
              })}
            </Typography>
          </CardContent>
        </Link>
      </CardActionArea>
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button size="small" onClick={handleShare}>
          Share
        </Button>
        {isTouchEnabled() ? null : (
          <IconButton
            size="small"
            sx={{ alignSelf: "flex-end" }}
            onClick={handleDelete}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

export default function HistoryView() {
  const history = useSelector(getHistory);
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();

  const deleteHandler = React.useCallback(
    (index: number) => {
      const item = history[index];
      dispatch(removeFromHistory(item.id));
    },
    [dispatch, history]
  );

  if (!history.length) {
    return (
      <Container
        disableGutters
        sx={{
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography textAlign="center" variant="h5">
          No History!
        </Typography>
      </Container>
    );
  }

  const handleClose = () => {
    setMessage("");
  };

  return (
    <>
      <Snackbar
        open={!!message}
        autoHideDuration={4000}
        onClose={handleClose}
        message={message}
        sx={{ bottom: { xs: 90, sm: 0 } }}
      >
        <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <SwipeableList
        items={history}
        onChange={deleteHandler}
        generateListItem={(item: IDisplayableHistoricalBill) => (
          <HistoryCard
            key={item.id}
            historyItem={item}
            triggerInfoPopup={() => setMessage("Copied to clipboard!")}
          />
        )}
        generateKey={(item: IDisplayableHistoricalBill) => item.id}
      />
    </>
  );
}
