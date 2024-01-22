import {
  Box,
  Typography,
  CssBaseline,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Link,
} from "@mui/material";
import * as React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import NextLink from "next/link";

interface Props {
  children?: React.ReactNode;
  navItems: Array<{
    label: string | React.ReactNode;
    href: string;
  }>;
}

export default function DrawerAppBar(props: Props) {
  const { children, navItems } = props;

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: "block" }}
          >
            <Link
              component={NextLink}
              sx={{ color: "inherit", textDecoration: "none" }}
              href={navItems[0].href}
            >
              YABS
            </Link>
          </Typography>
          <Box sx={{ display: "block" }}>
            <nav>
              {navItems.slice(1).map((item) => (
                <Button
                  key={item.href}
                  sx={{ color: "#fff" }}
                  href={item.href}
                  LinkComponent={NextLink}
                >
                  {item.label}
                </Button>
              ))}
              <IconButton LinkComponent={NextLink} href="/settings">
                <SettingsIcon />
              </IconButton>
            </nav>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3, width: "100%" }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
