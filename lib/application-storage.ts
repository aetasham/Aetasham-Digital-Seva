import { get, list, put } from '@vercel/blob';

export type Application = {
  id: string;
  service: string;
  name: string;
  mobile: string;
  details: string;
  status: 'Submitted' | 'Processing' | 'Completed' | 'Rejected';
  createdAt: string;
  updatedAt: string;
};

export async function readApplication(id: string) {
  const result = await get(`applications/${id}.json`, { access: 'private' });
  if (result?.statusCode !== 200) return null;
  return JSON.parse(await new Response(result.stream).text()) as Application;
}

export async function listApplications() {
  const result = await list({ prefix: 'applications/' });
  const rows: Application[] = [];
  for (const blob of result.blobs) {
    try {
      const item = await get(blob.pathname, { access: 'private' });
      if (item?.statusCode === 200) rows.push(JSON.parse(await new Response(item.stream).text()));
    } catch (error) {
      console.error('Application read error:', error);
    }
  }
  return rows.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

export async function updateApplicationStatus(id: string, status: Application['status']) {
  const application = await readApplication(id);
  if (!application) return null;
  const updated = { ...application, status, updatedAt: new Date().toISOString() };
  await put(`applications/${id}.json`, JSON.stringify(updated), { access: 'private', allowOverwrite: true, contentType: 'application/json' });
  return updated;
}
