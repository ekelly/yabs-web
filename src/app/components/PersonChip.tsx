import { styled, useMediaQuery, useTheme } from "@mui/material";
import Chip, { ChipProps } from "@mui/material/Chip";

function hueFromId(id: string) {
  const idAsNumber = parseInt(id.replaceAll("-", ""), 16);
  return idAsNumber % 360;
}

export const PersonChip = styled(Chip)<ChipProps & { id: string }>(
  ({ variant, id }) => {
    const theme = useTheme();
    const hue = hueFromId(id);
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const activeColor = `hsl(${hue}, 75%, ${prefersDarkMode ? "40%" : "75%"})`;
    const inactiveColor = `hsl(${hue}, 20%, 85%)`;
    const borderColor = `hsl(${hue}, 50%, 30%)`;
    return {
      margin: "2px 1px",
      ...(variant === undefined && {
        backgroundColor: activeColor,
      }),
      ...(variant === "outlined" && {
        border: `1px solid ${borderColor}`,
        backgroundColor: activeColor,
        ":hover": {
          backgroundColor: `${inactiveColor} !important`,
        },
      }),
      ...(variant === "filled" && {
        color: "gray",
        backgroundColor: inactiveColor,
        ":hover": {
          color: theme.palette.text.primary,
          backgroundColor: activeColor,
        },
      }),
    };
  }
);
