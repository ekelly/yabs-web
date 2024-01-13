import { styled } from "@mui/material";
import Chip, { ChipProps } from "@mui/material/Chip";

function hueFromId(id: string) {
  const idAsNumber = parseInt(id.replaceAll("-", ""), 16);
  return idAsNumber % 360;
}

export const PersonChip = styled(Chip)<ChipProps & { id: string }>(
  ({ variant, id }) => {
    const hue = hueFromId(id);
    const activeColor = `hsl(${hue}, 75%, 75%)`;
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
          backgroundColor: inactiveColor,
        },
      }),
      ...(variant === "filled" && {
        color: "gray",
        backgroundColor: inactiveColor,
        ":hover": {
          backgroundColor: activeColor,
        },
      }),
    };
  }
);
