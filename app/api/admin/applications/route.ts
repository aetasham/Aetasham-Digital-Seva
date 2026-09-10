import { requireAdmin } from '@/lib/admin-auth';
import { listApplications } from '@/lib/application-storage';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await requireAdmin();
    return Response.json({ applications: await listApplications() });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return Response.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('Admin applications error:', error);
    return Response.json({ error: 'Unable to load applications.' }, { status: 500 });
  }
}
