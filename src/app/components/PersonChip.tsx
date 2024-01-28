import { styled, useMediaQuery, useTheme } from "@mui/material";
import Chip, { ChipProps } from "@mui/material/Chip";

function hueFromId(id: string) {
  const idAsNumber = parseInt(id.replaceAll("-", ""), 16);
  return idAsNumber % 360;
}

type PersonChipProps = {
  id: string;
  colorOverrides?: {
    background: string;
    hover: string;
  };
};

export const PersonChip = styled(Chip)<ChipProps & PersonChipProps>(
  ({ variant, id, onClick, colorOverrides }) => {
    const theme = useTheme();
    const hue = hueFromId(id);
    const editable = !!onClick;
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const activeColor = `hsl(${hue}, 75%, ${prefersDarkMode ? "40%" : "75%"})`;
    const inactiveColor = `hsl(${hue}, 20%, 85%)`;
    const borderColor = `hsl(${hue}, 50%, 30%)`;

    const hoverEffect = {
      outlined: {
        "@media (hover: hover)": {
          ":hover": {
            backgroundColor: editable
              ? `${inactiveColor} !important`
              : `${activeColor} !important`,
          },
        },
        "@media (hover: none)": {
          ":hover": {
            backgroundColor: `${activeColor} !important`,
          },
        },
      },
      filled: {
        "@media (hover: hover)": {
          ":hover": {
            color: theme.palette.text.primary,
            backgroundColor: activeColor,
          },
        },
        "@media (hover: none)": {
          ":hover": {
            backgroundColor: editable
              ? `${inactiveColor} !important`
              : `${activeColor} !important`,
          },
        },
      },
      override: {
        "@media (hover: hover)": {
          ":hover": {
            backgroundColor: colorOverrides?.hover,
          },
        },
        "@media (hover: none)": {
          ":hover": {
            backgroundColor: editable
              ? `${colorOverrides?.hover} !important`
              : `${colorOverrides?.background} !important`,
          },
        },
      },
    };

    return {
      margin: "2px 1px",
      ...(variant === undefined && {
        backgroundColor: activeColor,
      }),
      ...(variant === "outlined" && {
        border: `1px solid ${borderColor}`,
        backgroundColor: activeColor,
        ...hoverEffect.outlined,
      }),
      ...(variant === "filled" && {
        color: "gray",
        backgroundColor: inactiveColor,
        ...hoverEffect.filled,
      }),
      ...(colorOverrides
        ? {
            backgroundColor: colorOverrides.background,
            ...hoverEffect.override,
          }
        : {}),
    };
  }
);
