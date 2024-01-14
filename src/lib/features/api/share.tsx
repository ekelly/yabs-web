import * as React from "react";
import type { ReactElement } from "react";

export const supportsShare = () => typeof navigator.share !== 'undefined' && navigator.share;

export async function nativeShare(title: string, description: string, url?: string) {
    try {
        await navigator.share({title, text: description, url});
    } catch (error) {
        console.log('Error sharing: ' + error);
        return;
    }
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