'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useEffect, useState } from 'react';

function StatusForm() {
  const params = useSearchParams();
  const [id, setId] = useState(params.get('id') || '');
  const [data, setData] = useState<any>(null);
  const [message, setMessage] = useState('');

  function check(e?: FormEvent) {
    e?.preventDefault();
    const value = id.trim();
    if (!value) {
      setMessage('Please enter your request ID.');
      setData(null);
      return;
    }
    const raw = localStorage.getItem('ads_' + value);
    if (raw) {
      setData(JSON.parse(raw));
      setMessage('');
    } else {
      setData(null);
      setMessage('No request found in this browser. Please check the ID.');
    }
  }

  useEffect(() => {
    const queryId = params.get('id');
    if (queryId) {
      setId(queryId);
      const raw = localStorage.getItem('ads_' + queryId);
      if (raw) {
        setData(JSON.parse(raw));
        setMessage('');
      } else {
        setMessage('No request found in this browser. Please check the ID.');
      }
    }
  }, [params]);

  return (
    <section className="section">
      <div className="formbox">
        <span className="eyebrow">TRACK REQUEST</span>
        <h2>Application Status</h2>
        <p>Enter the request ID received after submitting a service request.</p>
        <form onSubmit={check}><label>Request ID<input value={id} onChange={e => setId(e.target.value)} placeholder="Example: ADS12345678" required /></label><button className="primary">Check Status</button></form>
        {message && <div className="notice"><div><b>{message}</b></div></div>}
        {data && <div className="notice"><div><b>{data.service}</b><p>Applicant: {data.name}<br />Status: <strong>{data.status}</strong><br />Request ID: {data.id}</p></div></div>}
      </div>
    </section>
  );
}

export default function StatusPage() {
  return (
    <main>
      <header className="topbar"><div className="brand"><div className="logo">A</div><div><b>Aetasham Digital Seva</b><small>Private Digital Service Centre</small></div></div><nav><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/apply">Apply Online</Link><Link href="/status">Status</Link><Link href="/login">Login</Link></nav></header>
      <Suspense fallback={<section className="section"><div className="formbox"><p>Loading status checker...</p></div></section>}><StatusForm /></Suspense>
      <footer>Private digital assistance centre · Not an official government or CSC portal</footer>
    </main>
  );
}
