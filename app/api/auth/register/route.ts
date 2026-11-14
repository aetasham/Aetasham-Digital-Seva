import { registerUser, setUserSession } from '@/lib/user-auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const mobile = String(body.mobile || '').trim();
    const password = String(body.password || '');
    if (name.length < 2 || name.length > 80 || !/^[0-9]{10}$/.test(mobile) || password.length < 8 || password.length > 128) {
      return Response.json({ error: 'Enter a name, valid 10-digit mobile number and password of at least 8 characters.' }, { status: 400 });
    }
    const user = await registerUser(name, mobile, password);
    await setUserSession(user.id);
    return Response.json({ user: { name: user.name, mobile: user.mobile } });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('unique') || message.includes('duplicate')) return Response.json({ error: 'An account with this mobile number already exists. Please log in.' }, { status: 409 });
    console.error('Registration error:', error);
    return Response.json({ error: 'Account registration is unavailable. Please try again later.' }, { status: 503 });
  }
}
