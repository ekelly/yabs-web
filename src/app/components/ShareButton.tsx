import ShareIcon from "@mui/icons-material/Share";
import { IconButton, SxProps, Theme } from "@mui/material";
import { shareText } from "~/lib/features/api/share";
import { IDisplayableBill } from "~/lib/features/core/billMath";

interface ShareButtonProps {
  billData: IDisplayableBill;
  id?: string;
  url?: string;
  sx?: SxProps<Theme>;
}

export default function ShareButton(props: ShareButtonProps) {
  const { billData, id, sx } = props;
  return (
    <IconButton onClick={() => shareText(billData, id)} sx={sx}>
      <ShareIcon />
    </IconButton>
  );
}
