import { Box, Fab, Zoom, useTheme } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

interface SaveFABProps {
  hasTransactions: boolean;
  doneHandler: () => void;
}

export default function SaveFAB({
  doneHandler,
  hasTransactions,
}: SaveFABProps) {
  const theme = useTheme();
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  return (
    <Box
      sx={{
        position: { xs: "fixed", sm: "relative" },
        bottom: { xs: 16, sm: 20 },
        right: { xs: 16, sm: -500 },
      }}
    >
      <Zoom
        key={"save"}
        in={hasTransactions}
        timeout={transitionDuration}
        style={{
          transitionDelay: `${hasTransactions ? transitionDuration.exit : 0}ms`,
        }}
        unmountOnExit
      >
        <Fab
          onClick={doneHandler}
          sx={{
            position: { sm: "fixed" },
            top: { sm: 150 },
          }}
        >
          <SaveIcon />
        </Fab>
      </Zoom>
    </Box>
  );
}
