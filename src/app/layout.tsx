"use client";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Container, CssBaseline, Paper, useMediaQuery } from "@mui/material";
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
    href: "/",
    component: <BillEntry />,
  },
  {
    label: "History",
    href: "/history",
    component: <HistoryView />,
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const phoneSized = useMediaQuery("(max-width:600px)");

  const pageContents = (
    <DrawerAppBar navItems={routes}>{children}</DrawerAppBar>
  );

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="manifest.json" />
        <link rel="apple-touch-icon" href="maskable/maskable_icon.png" />
        <meta name="apple-mobile-web-app-title" content="YABS" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="shortcut icon" sizes="32x32" href="ios/32.png" />
        <link
          rel="shortcut icon"
          sizes="167x167"
          href="icons/Yabs-Icon-1024.svg"
        />
        <title>YABS</title>
      </head>
      <body>
        <AppRouterCacheProvider>
          <ColorThemeProvider>
            <CssBaseline>
              <StoreProvider>
                <Container
                  maxWidth={phoneSized ? false : "sm"}
                  sx={{ display: "flex", flex: 1 }}
                >
                  {phoneSized ? (
                    pageContents
                  ) : (
                    <Paper
                      elevation={4}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      {pageContents}
                    </Paper>
                  )}
                </Container>
              </StoreProvider>
            </CssBaseline>
          </ColorThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
