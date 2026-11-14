import { clearUserSession } from '@/lib/user-auth';

export const runtime = 'nodejs';

export async function POST() {
  await clearUserSession();
  return Response.json({ ok: true });
}
