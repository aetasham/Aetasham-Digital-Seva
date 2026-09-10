import { NextResponse } from 'next/server';
import { adminCookie, createAdminToken } from '@/lib/admin-auth';
import crypto from 'node:crypto';

export const runtime = 'nodejs';

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

export async function POST(request: Request) {
  try {
    const { id, password } = await request.json();
    const expectedId = process.env.ADMIN_ID || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedPassword) return Response.json({ error: 'Admin login is not configured.' }, { status: 503 });
    if (!safeEqual(String(id || ''), expectedId) || !safeEqual(String(password || ''), expectedPassword)) return Response.json({ error: 'Invalid admin ID or password.' }, { status: 401 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(adminCookie(createAdminToken()));
    return response;
  } catch {
    return Response.json({ error: 'Invalid login request.' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({ name: 'ads_admin_session', value: '', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 });
  return response;
}
