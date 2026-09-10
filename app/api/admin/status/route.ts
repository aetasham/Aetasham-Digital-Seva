import { requireAdmin } from '@/lib/admin-auth';
import { updateApplicationStatus, Application } from '@/lib/application-storage';

export const runtime = 'nodejs';

const allowed: Application['status'][] = ['Submitted', 'Processing', 'Completed', 'Rejected'];

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const { id, status } = await request.json();
    if (!/^ADS[A-F0-9]{10}$/.test(String(id || '').toUpperCase()) || !allowed.includes(status)) return Response.json({ error: 'Invalid request.' }, { status: 400 });
    const updated = await updateApplicationStatus(String(id).toUpperCase(), status);
    if (!updated) return Response.json({ error: 'Application not found.' }, { status: 404 });
    return Response.json({ ok: true, application: updated });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return Response.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('Admin status update error:', error);
    return Response.json({ error: 'Unable to update application.' }, { status: 500 });
  }
}
