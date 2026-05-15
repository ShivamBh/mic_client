const CENTS_PER_WORKER = 25;
const MINUTES_PER_WORKER = 10;

export function donationSummary(amountDollars: number): string {
  const workers = Math.floor((amountDollars * 100) / CENTS_PER_WORKER);
  if (workers === 0) return 'Thank you for your payment.';
  const minutes = workers * MINUTES_PER_WORKER;
  return `Thank you for your payment. Your donation has provided ${minutes} minute${minutes !== 1 ? 's' : ''} of rest to ${workers} worker${workers !== 1 ? 's' : ''}.`;
}
