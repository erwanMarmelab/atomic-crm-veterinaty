/** Days threshold within which a vaccine is considered "expiring soon". */
const EXPIRING_SOON_DAYS = 30;

/**
 * Classifies a vaccination expiry date into one of three statuses:
 * - "expired"       — expires_on is in the past
 * - "expiring_soon" — expires within the next EXPIRING_SOON_DAYS days
 * - "valid"         — expires more than EXPIRING_SOON_DAYS days from now
 */
export function getExpiryStatus(
  expiresOn: string,
): "expired" | "expiring_soon" | "valid" {
  const now = new Date();
  const expiry = new Date(expiresOn);
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return "expired";
  if (diffDays <= EXPIRING_SOON_DAYS) return "expiring_soon";
  return "valid";
}
