const DEFAULT_DESCRIPTION = encodeURIComponent(
  "Settling up with Yet Another Bill Splitter"
);

export function getVenmoChargeDeeplink(
  amount: string,
  description?: string
): string {
  const note = description ? description : DEFAULT_DESCRIPTION;
  return `https://venmo.com/?txn=charge&note=${note}&amount=${amount}`;
}

export function getVenmoPayDeeplink(
  venmoUsername: string,
  description?: string,
  amount?: string
): string {
  const note = encodeURIComponent(
    description ? description : DEFAULT_DESCRIPTION
  );
  return `https://venmo.com/${venmoUsername}?txn=pay&note=${note}&amount=${amount}`;
}
