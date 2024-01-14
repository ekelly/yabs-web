import { Button } from "@mui/material";
import Image from "next/image";
import { getVenmoDeeplink } from "~/lib/features/api/venmo";

interface VenmoButtonProps {
    amount: number,
    description?: string,
}

export const isMobileDevice = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function VenmoButton(props: VenmoButtonProps) {

    return isMobileDevice() ? <Button 
        sx={{ backgroundColor: "#008CFF", 
            '&:hover': {
                backgroundColor: "#0072cf",
          }, }}
        href={getVenmoDeeplink(props.amount, props.description)}
    ><Image width={48} height={12} alt="Venmo" src="./Venmo_Logo_White_small.png" /></Button> : null;
}