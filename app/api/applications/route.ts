import crypto from 'node:crypto';
import { createApplication, readApplication } from '../../../lib/application-storage';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const service = String(body.service || '').trim();
    const name = String(body.name || '').trim();
    const mobile = String(body.mobile || '').trim();
    const details = String(body.details || '').trim();
    if (!service || !name || !/^\d{10}$/.test(mobile)) return Response.json({ error: 'Please provide a valid service, name and 10-digit mobile number.' }, { status: 400 });
    if (name.length > 80 || details.length > 500) return Response.json({ error: 'Input is too long.' }, { status: 400 });
    const id = `ADS${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
    const now = new Date().toISOString();
    const application = { id, service, name, mobile, details, status: 'Submitted' as const, createdAt: now, updatedAt: now };
    await createApplication(application);
    return Response.json({ id, status: application.status });
  } catch (error) {
    console.error('Application create error:', error);
    return Response.json({ error: 'Application service is not configured. Please contact the centre.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id')?.trim().toUpperCase();
    if (!id || !/^ADS[A-F0-9]{10}$/.test(id)) return Response.json({ error: 'Invalid request ID.' }, { status: 400 });
    const data = await readApplication(id);
    if (!data) return Response.json({ error: 'Request not found.' }, { status: 404 });
    return Response.json({ id: data.id, service: data.service, status: data.status, createdAt: data.createdAt, updatedAt: data.updatedAt });
  } catch (error) {
    console.error('Application lookup error:', error);
    return Response.json({ error: 'Unable to check application status right now.' }, { status: 500 });
  }
}
