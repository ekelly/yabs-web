"use client"
import * as React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {(value === index) ? children : null }
      </div>
    );
}

interface TabBarItem {
    label: string;
    component: React.ReactNode;
}

interface TabBarProps {
    items: TabBarItem[]
}

export default function TabBar(props: TabBarProps) {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} centered>
                    { ...props.items.map((item, index) => <Tab label={item.label} value={index} />) }
                </Tabs>
            </Box>
            { ...props.items.map((item, index) => <TabPanel children={item.component} index={index} value={value} />) }
        </>
    );
}