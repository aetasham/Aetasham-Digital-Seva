import { neon } from '@neondatabase/serverless';

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

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not configured');
  return neon(url);
}

let initialized = false;

async function ensureTable() {
  if (initialized) return;
  const sql = db();
  await sql`
    CREATE TABLE IF NOT EXISTS applications (
      id VARCHAR(32) PRIMARY KEY,
      service VARCHAR(120) NOT NULL,
      name VARCHAR(80) NOT NULL,
      mobile VARCHAR(10) NOT NULL,
      details VARCHAR(500) NOT NULL DEFAULT '',
      status VARCHAR(20) NOT NULL DEFAULT 'Submitted',
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS applications_created_at_idx ON applications (created_at DESC)`;
  initialized = true;
}

function mapRow(row: any): Application {
  return {
    id: row.id,
    service: row.service,
    name: row.name,
    mobile: row.mobile,
    details: row.details,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function createApplication(application: Application) {
  await ensureTable();
  const sql = db();
  await sql`
    INSERT INTO applications (id, service, name, mobile, details, status, created_at, updated_at)
    VALUES (${application.id}, ${application.service}, ${application.name}, ${application.mobile}, ${application.details}, ${application.status}, ${application.createdAt}, ${application.updatedAt})
  `;
  return application;
}

export async function readApplication(id: string) {
  await ensureTable();
  const sql = db();
  const rows = await sql`SELECT * FROM applications WHERE id = ${id} LIMIT 1`;
  return rows.length ? mapRow(rows[0]) : null;
}

export async function listApplications() {
  await ensureTable();
  const sql = db();
  const rows = await sql`SELECT * FROM applications ORDER BY created_at DESC`;
  return rows.map(mapRow);
}

export async function updateApplicationStatus(id: string, status: Application['status']) {
  await ensureTable();
  const sql = db();
  const now = new Date().toISOString();
  const rows = await sql`
    UPDATE applications
    SET status = ${status}, updated_at = ${now}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows.length ? mapRow(rows[0]) : null;
}
