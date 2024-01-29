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
import Image from "next/image";
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
          <Link
            component={NextLink}
            sx={{
              color: "inherit",
              textDecoration: "none",
              flexGrow: 1,
              display: "block",
            }}
            href={navItems[0].href}
          >
            <Image
              src="icons/Yabs-Icon-1024.svg"
              alt="Logo"
              width={30}
              height={30}
              style={{
                float: "left",
              }}
            />
            <Typography variant="h6" component="div">
              YABS
            </Typography>
          </Link>
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
              <IconButton
                LinkComponent={NextLink}
                href="/settings"
                sx={{ color: "#fff" }}
              >
                <SettingsIcon />
              </IconButton>
            </nav>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          pb: 3,
          paddingX: { xs: 0, sm: 3 },
          width: "100%",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
