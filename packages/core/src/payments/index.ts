export function createPaymentIntent(
  amount: number,
  currency: string = 'usd'
): Promise<{ clientSecret: string }> {
  return fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount: Math.round(amount * 100), currency }),
  }).then((res) => res.json());
}

export function confirmPayment(paymentIntentId: string): Promise<void> {
  return fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/confirm-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentIntentId }),
  }).then((res) => res.json());
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function calculateDriverPayout(rideFare: number, platformFee: number = 0.2): number {
  return rideFare * (1 - platformFee);
}

export function generateReceipt(ride: {
  id: string;
  pickup_address: string;
  dropoff_address: string;
  distance: number;
  duration: number;
  fare: number;
  payment_method: string;
  completed_at: string;
}): string {
  return `
Ride Receipt
============
Ride ID: ${ride.id}

From: ${ride.pickup_address}
To: ${ride.dropoff_address}

Distance: ${ride.distance.toFixed(1)} km
Duration: ${ride.duration} min

Total Fare: ${formatCurrency(ride.fare)}
Payment: ${ride.payment_method}

Completed: ${new Date(ride.completed_at).toLocaleString()}

Thank you for riding with Joshua!
  `.trim();
}
