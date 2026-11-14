import { currentUser } from '@/lib/user-auth';

export const runtime = 'nodejs';

export async function GET() {
  try { return Response.json({ user: await currentUser() }); }
  catch { return Response.json({ user: null }, { status: 503 }); }
}
