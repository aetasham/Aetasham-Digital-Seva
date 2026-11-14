import { verifyUser, setUserSession } from '@/lib/user-auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mobile = String(body.mobile || '').trim();
    const password = String(body.password || '');
    if (!/^[0-9]{10}$/.test(mobile) || !password || password.length > 128) return Response.json({ error: 'Enter your registered mobile number and password.' }, { status: 400 });
    const user = await verifyUser(mobile, password);
    if (!user) return Response.json({ error: 'Mobile number or password is incorrect.' }, { status: 401 });
    await setUserSession(user.id);
    return Response.json({ user: { name: user.name, mobile: user.mobile } });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'Login is unavailable. Please try again later.' }, { status: 503 });
  }
}
