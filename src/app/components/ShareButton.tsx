"use client";
import ShareIcon from "@mui/icons-material/Share";
import { IconButton, SxProps, Theme } from "@mui/material";
import { shareText } from "~/lib/features/api/share";
import { IDisplayableBill } from "~/lib/features/core/billMath";

interface ShareButtonProps {
  billData: IDisplayableBill;
  id?: string;
  sx?: SxProps<Theme>;
}

/**
 * This component represents a button for triggering the share action.
 */
export const ShareButton: React.FC<ShareButtonProps> = ({
  billData,
  id,
  sx,
}) => {
  return (
    <IconButton onClick={() => shareText(billData, id)} sx={sx}>
      <ShareIcon />
    </IconButton>
  );
};
