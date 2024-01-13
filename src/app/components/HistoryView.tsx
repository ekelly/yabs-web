import * as React from "react";
import { useSelector } from "react-redux";
import { getHistory } from "~/lib/features/history";
import { Card, CardContent, CardActions, Button, List, ListItem } from "@mui/material";
import { Typography } from "@mui/material";
import { IHistoryItem } from "~/lib/features/history/types";

interface HistoryCardProps {
    historyItem: IHistoryItem;
}

const HistoryCard = (props: HistoryCardProps) => {
    const { historyItem } = props;
    return (
    <Card sx={{ width: "100%" }} variant="outlined">
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

    return (
        <List>
        { ...history.records.map((i) => <ListItem><HistoryCard historyItem={i} /></ListItem>) }
        </List>
    );
}