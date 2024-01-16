import { NativeShareComponent } from "~/lib/features/api/share";
import ShareIcon from '@mui/icons-material/Share';
import { IconButton, SxProps, Theme } from '@mui/material';
import { shareToNative } from "~/lib/features/api/share";
import { IDisplayableBill } from "~/lib/features/core/billMath";

interface ShareButtonProps {
    billData: IDisplayableBill,
    id?: string,
    url?: string,
    sx?: SxProps<Theme>;
}

export default function ShareButton(props: ShareButtonProps) {
    const { billData, id, sx } = props;
    return <NativeShareComponent>
        <IconButton
            onClick={() => shareToNative(billData, id)}
            sx={sx}
        >
            <ShareIcon />
        </IconButton>
    </NativeShareComponent>;
}