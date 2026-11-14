import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { neon } from '@neondatabase/serverless';

const scrypt = promisify(crypto.scrypt);
const COOKIE = 'ads_user_session';

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not configured');
  return neon(url);
}

async function ensureUsers() {
  const db = sql();
  await db`CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(40) PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    mobile VARCHAR(10) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
}

export async function registerUser(name: string, mobile: string, password: string) {
  await ensureUsers();
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = await scrypt(password, salt, 64) as Buffer;
  const hash = `${salt}:${derived.toString('hex')}`;
  const id = crypto.randomUUID();
  const db = sql();
  await db`INSERT INTO users (id, name, mobile, password_hash) VALUES (${id}, ${name}, ${mobile}, ${hash})`;
  return { id, name, mobile };
}

export async function verifyUser(mobile: string, password: string) {
  await ensureUsers();
  const db = sql();
  const rows = await db`SELECT id, name, mobile, password_hash FROM users WHERE mobile = ${mobile} LIMIT 1`;
  if (!rows.length) return null;
  const [salt, saved] = String(rows[0].password_hash).split(':');
  if (!salt || !saved) return null;
  const derived = await scrypt(password, salt, 64) as Buffer;
  const expected = Buffer.from(saved, 'hex');
  if (expected.length !== derived.length || !crypto.timingSafeEqual(expected, derived)) return null;
  return { id: String(rows[0].id), name: String(rows[0].name), mobile: String(rows[0].mobile) };
}

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('ADMIN_SESSION_SECRET must be at least 32 characters');
  return secret;
}

export function createUserSession(userId: string) {
  const payload = `${userId}.${Date.now()}`;
  const signature = crypto.createHmac('sha256', sessionSecret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function validSession(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = crypto.createHmac('sha256', sessionSecret()).update(payload).digest('base64url');
  const a = Buffer.from(parts[2]);
  const b = Buffer.from(expected);
  const age = Date.now() - Number(parts[1]);
  return a.length === b.length && crypto.timingSafeEqual(a, b) && Number.isFinite(age) && age >= 0 && age < 1000 * 60 * 60 * 24 * 7;
}

export async function setUserSession(userId: string) {
  const store = await cookies();
  store.set(COOKIE, createUserSession(userId), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearUserSession() {
  const store = await cookies();
  store.set(COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
}

export async function currentUser() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token || !validSession(token)) return null;
  const userId = token.split('.')[0];
  await ensureUsers();
  const db = sql();
  const rows = await db`SELECT id, name, mobile FROM users WHERE id = ${userId} LIMIT 1`;
  return rows.length ? { id: String(rows[0].id), name: String(rows[0].name), mobile: String(rows[0].mobile) } : null;
}
