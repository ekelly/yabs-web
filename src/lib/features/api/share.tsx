import type { ReactElement } from "react";
import { SettingKey, getSetting } from "../settings";
import { getVenmoPayDeeplink } from "./venmo";

export const supportsNativeShare = () =>
  typeof navigator.share !== "undefined" && navigator.share;

async function nativeShare(title: string, description: string) {
  try {
    await navigator.share({ title, text: description });
  } catch (error) {
    console.log("Error sharing: " + error);
    return;
  }
}

type IBillData = {
  description: string;
  total: string;
  participants: { name: string; total: string; id: string }[];
};
function getShareDescription(billData: IBillData, id?: string) {
  const venmoUsername = getSetting(SettingKey.venmoUsername);
  if (id) {
    const person = billData.participants.find(
      (personContribution) => id === personContribution.id
    );
    if (person) {
      let message = `You owe ${person.total} for ${billData.description}`;
      if (venmoUsername) {
        message += `\n${getVenmoPayDeeplink(
          venmoUsername,
          billData.description,
          person.total
        )}`;
      }
      return message;
    }
  }
  let outputString = `Bill splitting totals for ${billData.description}:`;
  billData.participants.forEach((personContribution) => {
    outputString += `\n${personContribution.name}: $${personContribution.total}`;
    if (venmoUsername) {
      outputString += `\n${getVenmoPayDeeplink(
        venmoUsername,
        billData.description,
        personContribution.total
      )}\n`;
    }
  });
  return outputString;
}

function shareToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export async function shareText(billData: IBillData, id?: string) {
  const description = getShareDescription(billData, id);
  return supportsNativeShare()
    ? nativeShare(billData.description, description)
    : shareToClipboard(description);
}

interface NativeShareComponentProps {
  children: ReactElement;
}
export const NativeShareComponent = (props: NativeShareComponentProps) => {
  const canShare = supportsNativeShare();

  if (!canShare) {
    return null;
  }

  return props.children;
};
