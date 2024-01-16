const DEFAULT_DESCRIPTION = encodeURIComponent("Settling up with Yet Another Bill Splitter");

export function getVenmoChargeDeeplink(amount: string, description?: string): string {
    let note = !!description ? description : DEFAULT_DESCRIPTION;
    return `https://venmo.com/?txn=charge&note=${note}&amount=${amount}`;
}

export function getVenmoPayDeeplink(venmoUsername: string, description?: string, amount?: string): string {
    let note = encodeURIComponent(!!description ? description : DEFAULT_DESCRIPTION);
    return `https://venmo.com/${venmoUsername}?txn=pay&note=${note}&amount=${amount}`;
}