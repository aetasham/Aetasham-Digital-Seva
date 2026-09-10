'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useEffect, useState } from 'react';

function StatusForm() {
  const params = useSearchParams(); const [id, setId] = useState(params.get('id') || ''); const [data, setData] = useState<any>(null); const [message, setMessage] = useState(''); const [loading, setLoading] = useState(false);
  async function check(e?: FormEvent) {
    e?.preventDefault(); const value = id.trim().toUpperCase(); if (!value) { setMessage('Please enter your request ID.'); setData(null); return; }
    setLoading(true); setMessage('');
    try { const response = await fetch(`/api/applications?id=${encodeURIComponent(value)}`, { cache: 'no-store' }); const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Request not found.'); setData(result); }
    catch (err) { setData(null); setMessage(err instanceof Error ? err.message : 'Unable to check status.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { const queryId = params.get('id'); if (queryId) { setId(queryId); void check(); } }, [params]);
  return <section className="section"><div className="formbox">
    <span className="eyebrow">TRACK REQUEST</span><h2>Application Status</h2><p>Enter the request ID received after submitting a service request.</p>
    <form onSubmit={check}><label>Request ID<input value={id} onChange={e => setId(e.target.value.toUpperCase())} placeholder="Example: ADSA1B2C3D4E5" required /></label><button className="primary" disabled={loading}>{loading ? 'Checking...' : 'Check Status'}</button></form>
    {message && <div className="notice"><div><b>{message}</b></div></div>}
    {data && <div className="notice"><div><b>{data.service}</b><p>Status: <strong>{data.status}</strong><br />Request ID: {data.id}</p></div></div>}
  </div></section>;
}

export default function StatusPage() { return <main>
  <header className="topbar"><div className="brand"><div className="logo">A</div><div><b>Aetasham Digital Seva</b><small>Private Digital Service Centre</small></div></div><nav><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/apply">Apply Online</Link><Link href="/status">Status</Link><Link href="/login">Login</Link></nav></header>
  <Suspense fallback={<section className="section"><div className="formbox"><p>Loading status checker...</p></div></section>}><StatusForm /></Suspense>
  <footer>Private digital assistance centre · Not an official government or CSC portal</footer>
</main>; }
