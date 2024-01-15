const DEFAULT_DESCRIPTION = encodeURIComponent("Settling up with Yet Another Bill Splitter");

export function getVenmoDeeplink(amount: string, description?: string): string {
    let note = !!description ? description : DEFAULT_DESCRIPTION;
    return `https://venmo.com/?txn=charge&note=${note}&amount=${amount}`;
}