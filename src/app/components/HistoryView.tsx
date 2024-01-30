"use client";
import * as React from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Typography } from "@mui/material";
import SwipeableList from "material-swipeable-list";
import { useAppDispatch, useAppSelector } from "~/lib/hooks";
import { isTouchEnabled } from "~/lib/utils";
import NextLink from "next/link";
import type { IDisplayableHistoricalBill } from "~/lib/features/history/selectors";
import { shareText } from "~/lib/features/api/share";
import { useCallback, useState } from "react";
import { InfoMessage } from "./InfoMessage";

interface HistoryCardProps {
  historyItem: IDisplayableHistoricalBill;
  triggerInfoPopup: () => void;
}

/**
 * This is an individual history "entry" in the list
 * of history items.
 */
const HistoryCard: React.FC<HistoryCardProps> = ({
  historyItem,
  triggerInfoPopup,
}) => {
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

/**
 * This is the 'root' component for seeing the history
 */
export const HistoryView: React.FC = () => {
  const dispatch = useAppDispatch();

  // The data that drives this component
  const history = useAppSelector(getHistory);
  const [message, setMessage] = useState("");

  // Swiping away individual history items will delete them
  const deleteHandler = useCallback(
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
      <InfoMessage message={message} handleClose={handleClose} />
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
};
