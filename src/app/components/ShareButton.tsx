import { NativeShareComponent } from "~/lib/features/api/share";
import ShareIcon from '@mui/icons-material/Share';
import { IconButton, SxProps, Theme } from '@mui/material';
import { nativeShare } from "~/lib/features/api/share";

interface ShareButtonProps {
    title: string,
    description: string,
    url?: string,
    sx?: SxProps<Theme>;
}

export default function ShareButton(props: ShareButtonProps) {
    const { title, description, sx } = props;
    return <NativeShareComponent>
        <IconButton
            onClick={() => nativeShare(title, description)}
            sx={sx}
        >
            <ShareIcon />
        </IconButton>
    </NativeShareComponent>;
}