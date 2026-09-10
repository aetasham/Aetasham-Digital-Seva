'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';

const options = ['PAN','Voter','Ration Card','Certificate','Government Scheme','Online Form','Print & Documents','Other'];

function ApplyForm() {
  const params = useSearchParams();
  const [service, setService] = useState(params.get('service') || '');
  const [name, setName] = useState(''); const [mobile, setMobile] = useState(''); const [details, setDetails] = useState('');
  const [result, setResult] = useState(''); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      const response = await fetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ service, name, mobile, details }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to submit request.');
      setResult(data.id); setName(''); setMobile(''); setDetails('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to submit request.'); }
    finally { setSaving(false); }
  }

  return <section className="section"><div className="formbox">
    <span className="eyebrow">APPLICATION REQUEST</span><h2>Apply for a Service</h2><p className="muted">Your request is securely saved for the centre to process.</p>
    <form onSubmit={submit}>
      <label>Service<select value={service} onChange={e => setService(e.target.value)} required><option value="">Select service</option>{options.map(x => <option key={x}>{x}</option>)}</select></label>
      <label>Applicant name<input value={name} onChange={e => setName(e.target.value)} required maxLength={80} /></label>
      <label>Mobile number<input value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))} inputMode="numeric" pattern="[0-9]{10}" maxLength={10} required /></label>
      <label>Request details<textarea value={details} onChange={e => setDetails(e.target.value)} rows={5} maxLength={500} placeholder="Tell us what service you need" /></label>
      <button className="primary" type="submit" disabled={saving}>{saving ? 'Submitting...' : 'Submit Request'}</button>
    </form>
    {error && <div className="notice"><div><b>{error}</b></div></div>}
    {result && <div className="notice"><div><b>Request submitted!</b><p>Your request ID is <strong>{result}</strong>. Save it to check status.</p><Link href={`/status?id=${result}`}>Check Status →</Link></div></div>}
  </div></section>;
}

export default function ApplyPage() { return <main>
  <header className="topbar"><div className="brand"><div className="logo">A</div><div><b>Aetasham Digital Seva</b><small>Private Digital Service Centre</small></div></div><nav><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/apply">Apply Online</Link><Link href="/status">Status</Link><Link href="/login">Login</Link></nav></header>
  <Suspense fallback={<section className="section"><div className="formbox"><p>Loading application form...</p></div></section>}><ApplyForm /></Suspense>
  <footer>Private digital assistance centre · Not an official government or CSC portal</footer>
</main>; }
