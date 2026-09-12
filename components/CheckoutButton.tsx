'use client';
import { useState } from 'react';

export function CheckoutButton({ plan }: { plan: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function checkout() {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-neo-cortex-user-approved': 'checkout' },
        body: JSON.stringify({ plan })
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error ?? 'Checkout is not configured yet.');
        return;
      }
      window.location.assign(data.url);
    } catch {
      setMessage('Checkout is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  }

  return <div><button className="priceButton" onClick={checkout} disabled={loading}>{loading ? 'Preparing…' : 'Start subscription'}</button>{message && <div className="microError" role="status">{message}</div>}</div>;
}
