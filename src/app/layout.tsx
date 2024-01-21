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
  const phoneSized = useMediaQuery("(max-width:600px)");

  const pageContents = (
    <DrawerAppBar navItems={routes}>{children}</DrawerAppBar>
  );

  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Register a service worker hosted at the root of the
      // site using the default scope.
      navigator.serviceWorker.register("/sw.js").then(
        (registration) => {
          console.log("Service worker registration succeeded:", registration);
        },
        (error) => {
          console.error(`Service worker registration failed: ${error}`);
        }
      );
    } else {
      console.error("Service workers are not supported.");
    }
  });

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="manifest.json" />
        <link rel="apple-touch-icon" href="icons/main-logo-192.png" />
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
