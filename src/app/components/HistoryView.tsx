import * as React from "react";
import { useSelector } from "react-redux";
import { getHistory, removeFromHistory } from "~/lib/features/history";
import { Card, CardContent, CardActions, Button, Container } from "@mui/material";
import { Typography } from "@mui/material";
import { IHistoryItem } from "~/lib/features/history/types";
import SwipeableList from "material-swipeable-list";
import { useAppDispatch } from "~/lib/hooks";

interface HistoryCardProps {
    historyItem: IHistoryItem;
}

const HistoryCard = (props: HistoryCardProps) => {
    const { historyItem } = props;
    return (
    <Card key={historyItem.id} sx={{ maxWidth: "98%", marginLeft: "5px", marginRight: "5px", display: "block", margin: "auto", marginBottom: "5px" }} variant="outlined">
      <CardContent>
        <Typography variant="h5" component="div">
          {historyItem.description}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          ${historyItem.total}
        </Typography>
        <Typography variant="body2">
          {...Object.values(historyItem.participants).map((p) => {
            return <><span>{p.name}: ${p.share}</span><br/></>;
          })}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
      </CardActions>
    </Card>);
};

export default function HistoryView() {
    const history = useSelector(getHistory);
    const dispatch = useAppDispatch();

    const deleteHandler = React.useCallback((index: number) => {
        const item = history.records[index];
        dispatch(removeFromHistory(item.id));
    }, []);

    if (!history.records.length) {
      return <Container disableGutters sx={{
        flexDirection: "column",
        justifyContent: "center"
      }}><Typography textAlign="center" variant="h5">No History!</Typography></Container>
    }

    return (
        <SwipeableList
            items={history.records}
            onChange={deleteHandler}
            generateListItem={(item: IHistoryItem) => <HistoryCard key={item.id} historyItem={item} />}
            generateKey={(item: IHistoryItem) => item.id}
        />
    );
}