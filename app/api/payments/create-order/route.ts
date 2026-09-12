import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: 'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel Environment Variables.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const amount = Number(body.amount);
    const receipt = String(body.receipt || `seva_${Date.now()}`).slice(0, 40);

    if (!Number.isInteger(amount) || amount < 100) {
      return NextResponse.json({ error: 'Invalid payment amount.' }, { status: 400 });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency: 'INR', receipt }),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data?.error?.description || 'Unable to create Razorpay order.' }, { status: 502 });
    }

    return NextResponse.json({ id: data.id, amount: data.amount, currency: data.currency, keyId });
  } catch {
    return NextResponse.json({ error: 'Unable to create payment order.' }, { status: 500 });
  }
}
