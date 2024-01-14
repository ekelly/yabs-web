import { Box, Typography, CssBaseline, AppBar, Toolbar, Button } from "@mui/material";
import * as React from "react";
import Link from "~/lib/Link";

interface Props {
    children?: React.ReactNode;
    navItems: Array<{
        label: string;
        href: string;
    }>;
}

export default function DrawerAppBar(props: Props) {
    const { children, navItems } = props;
  
    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar component="nav">
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              <Link sx={{ color: "inherit", textDecoration: "none" }} href={navItems[0].href}>
              YABS
              </Link>
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <nav>
                    {navItems.slice(1).map((item) => (
                        <Button key={item.href} sx={{ color: '#fff' }} href={item.href} LinkComponent={Link}>
                        {item.label}
                        </Button>
                    ))}
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