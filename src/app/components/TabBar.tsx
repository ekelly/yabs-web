import * as React from "react";
import { Tabs, Tab } from "@mui/material";

export default function TabBar() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (<Tabs value={value} onChange={handleChange} centered>
        <Tab label="New Bill" />
        <Tab label="History" />
    </Tabs>);
}