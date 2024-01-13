"use client"
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { CssBaseline } from "@mui/material";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ColorThemeProvider from "./ColorThemeProvider";
import TabBar from "./components/TabBar";
import BillEntry from "./components/BillEntry";
import HistoryView from "./components/HistoryView";

const routes = [
  {
    label: "Bill Entry",
    component: <BillEntry />
  },
  {
    label: "History",
    component: <HistoryView />
  }
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ColorThemeProvider>
            <CssBaseline>
              <StoreProvider>
                <TabBar items={routes} />
                {children}
              </StoreProvider>
            </CssBaseline>
          </ColorThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
