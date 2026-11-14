import crypto from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const databaseUrl = process.env.DATABASE_URL;
  if (!keyId || !keySecret || !databaseUrl) return NextResponse.json({ error: 'Payment verification is not configured.' }, { status: 503 });

  try {
    const body = await request.json();
    const applicationId = String(body.applicationId || '').trim().toUpperCase();
    const orderId = String(body.razorpay_order_id || '');
    const paymentId = String(body.razorpay_payment_id || '');
    const signature = String(body.razorpay_signature || '');
    if (!/^ADS[A-F0-9]{10}$/.test(applicationId) || !orderId.startsWith('order_') || !paymentId.startsWith('pay_') || !signature) {
      return NextResponse.json({ error: 'Invalid payment confirmation.' }, { status: 400 });
    }

    const expected = crypto.createHmac('sha256', keySecret).update(`${orderId}|${paymentId}`).digest('hex');
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (actualBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(actualBuffer, expectedBuffer)) {
      return NextResponse.json({ error: 'Payment signature could not be verified.' }, { status: 400 });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const orderResponse = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, {
      headers: { Authorization: `Basic ${auth}` }, cache: 'no-store',
    });
    const order = await orderResponse.json();
    if (!orderResponse.ok || order.receipt !== applicationId || order.amount !== 14900 || order.currency !== 'INR') {
      return NextResponse.json({ error: 'Payment order does not match this application.' }, { status: 400 });
    }

    const db = neon(databaseUrl);
    await db`CREATE TABLE IF NOT EXISTS application_payments (
      order_id VARCHAR(80) PRIMARY KEY,
      application_id VARCHAR(32) NOT NULL,
      payment_id VARCHAR(80) UNIQUE NOT NULL,
      amount INTEGER NOT NULL,
      status VARCHAR(20) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;
    await db`INSERT INTO application_payments (order_id, application_id, payment_id, amount, status)
      VALUES (${orderId}, ${applicationId}, ${paymentId}, 14900, 'paid')
      ON CONFLICT (order_id) DO UPDATE SET payment_id = EXCLUDED.payment_id, status = 'paid'`;
    return NextResponse.json({ ok: true, status: 'paid', applicationId });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Unable to verify payment right now.' }, { status: 500 });
  }
}
