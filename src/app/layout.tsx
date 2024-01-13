"use client";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Container, CssBaseline, Paper } from "@mui/material";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ColorThemeProvider from "./ColorThemeProvider";
import DrawerAppBar from "./components/AppBar";
import BillEntry from "./components/BillEntry";
import HistoryView from "./components/HistoryView";

const routes = [
  {
    label: "Home",
    href: "home",
    component: <BillEntry />,
  },
  {
    label: "History",
    href: "history",
    component: <HistoryView />,
  },
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
                <Container maxWidth="sm" sx={{ display: "flex", flex: 1 }}>
                  <Paper
                    elevation={4}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <DrawerAppBar navItems={routes}>
                      {children}
                    </DrawerAppBar>
                  </Paper>
                </Container>
              </StoreProvider>
            </CssBaseline>
          </ColorThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
