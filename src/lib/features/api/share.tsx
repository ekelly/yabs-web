import * as React from "react";
import type { ReactElement } from "react";

export const supportsShare = () => typeof navigator.share !== 'undefined' && navigator.share;

async function nativeShare(title: string, description: string) {
    try {
        await navigator.share({title, text: description});
    } catch (error) {
        console.log('Error sharing: ' + error);
        return;
    }
}

type IBillData = {
    description: string;
    total: string;
    participants: { name: string; total: string, id: string }[]
};
function getShareDescription(billData: IBillData, id?: string) {
    if (id) {
        const person = billData.participants.find(personContribution => id === personContribution.id);
        if (person) {
            return `You owe ${person.total} for ${billData.description}`;
        }
    }
    let outputString = `Bill splitting totals for ${billData.description}:`;
    billData.participants.forEach((personContribution) => {
        outputString += `\n${personContribution.name}: $${personContribution.total}`;
    });
    return outputString;
};

export async function shareToNative(billData: IBillData, id?: string) {
    const description = getShareDescription(billData, id);
    return nativeShare(billData.description, description);
}

interface NativeShareComponentProps {
    children: ReactElement;
}
export const NativeShareComponent = (props: NativeShareComponentProps) => {
    const canShare = supportsShare() || true;

    if (!canShare) {
        return null;
    }

    return props.children;
}