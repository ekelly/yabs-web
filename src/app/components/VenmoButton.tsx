"use client";
import { Button } from "@mui/material";
import Image from "next/image";
import { getVenmoChargeDeeplink } from "~/lib/features/api/venmo";

interface VenmoButtonProps {
  amount: string;
  description?: string;
}

export const isMobileDevice = () =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

/**
 * This component creates a Venmo button that deep links
 * into the Venmo app.
 */
export const VenmoButton: React.FC<VenmoButtonProps> = ({
  amount,
  description,
}) => {
  return isMobileDevice() ? (
    <Button
      sx={{
        backgroundColor: "#008CFF",
        "&:hover": {
          backgroundColor: "#0072cf",
        },
      }}
      href={getVenmoChargeDeeplink(amount, description)}
    >
      <Image
        width={48}
        height={12}
        alt="Venmo"
        src="./Venmo_Logo_White_small.png"
      />
    </Button>
  ) : null;
};
