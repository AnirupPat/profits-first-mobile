export const VALID_INVITE_CODES = [
  'PROFITS-DEMO',
  'PROFITS-VIP',
  'PROFITS-EARLY',
  'PROFITS-SANJAY',
] as const;

export function isValidInvite(code: string): boolean {
  const normalized = code.trim().toUpperCase();
  return (VALID_INVITE_CODES as readonly string[]).includes(normalized);
}
