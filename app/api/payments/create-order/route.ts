import { readApplication } from '@/lib/application-storage';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return NextResponse.json({ error: 'Payment is not configured yet. Please contact the service centre.' }, { status: 503 });

  try {
    const body = await request.json();
    const applicationId = String(body.applicationId || '').trim().toUpperCase();
    if (!/^ADS[A-F0-9]{10}$/.test(applicationId)) return NextResponse.json({ error: 'Invalid application ID.' }, { status: 400 });
    const application = await readApplication(applicationId);
    if (!application || application.service !== 'PAN') return NextResponse.json({ error: 'This application is not eligible for this payment.' }, { status: 404 });

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 14900, currency: 'INR', receipt: applicationId, notes: { application_id: applicationId, service: 'PAN' } }),
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data?.error?.description || 'Unable to create payment order.' }, { status: 502 });
    return NextResponse.json({ id: data.id, amount: data.amount, currency: data.currency, keyId });
  } catch (error) {
    console.error('Create payment order error:', error);
    return NextResponse.json({ error: 'Unable to create payment order.' }, { status: 500 });
  }
}
