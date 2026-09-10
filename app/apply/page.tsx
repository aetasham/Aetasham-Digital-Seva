'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useEffect, useState } from 'react';

const options = [
  ['PAN', 'PAN Services'], ['Voter', 'Voter Services'], ['Ration Card', 'Ration Card'],
  ['Certificate', 'Certificates'], ['Government Scheme', 'Government Schemes'],
  ['Online Form', 'Online Forms'], ['Print & Documents', 'Print & Documents'], ['Other', 'Other Digital Services'],
];

function ApplyForm() {
  const params = useSearchParams();
  const [service, setService] = useState(params.get('service') || '');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [details, setDetails] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { setService(params.get('service') || ''); }, [params]);

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setResult('');
    if (!/^[0-9]{10}$/.test(mobile)) { setError('Please enter a valid 10-digit mobile number.'); return; }
    setSaving(true);
    try {
      const response = await fetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ service, name: name.trim(), mobile, details: details.trim() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to submit request.');
      setResult(data.id); setName(''); setMobile(''); setDetails('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to submit request.'); }
    finally { setSaving(false); }
  }

  return <section className="section">
    <div className="formbox">
      <span className="eyebrow">ONLINE APPLICATION</span><h2>Apply for a Service</h2>
      <p className="muted">Submit your request online. The centre can review and process it after submission.</p>
      <form onSubmit={submit}>
        <label>Service<select value={service} onChange={e => setService(e.target.value)} required><option value="">Select a service</option>{options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>Applicant name<input value={name} onChange={e => setName(e.target.value)} required maxLength={80} placeholder="Enter applicant name" /></label>
        <label>Mobile number<input value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" pattern="[0-9]{10}" maxLength={10} required placeholder="10-digit mobile number" /></label>
        <label>Request details<textarea value={details} onChange={e => setDetails(e.target.value)} rows={5} maxLength={500} placeholder="Describe the service or assistance you need" /></label>
        <button className="primary" type="submit" disabled={saving}>{saving ? 'Submitting Request...' : 'Submit Application →'}</button>
      </form>
      {error && <div className="notice"><div><b>Submission failed</b><p>{error}</p></div></div>}
      {result && <div className="notice"><div><b>Application submitted successfully 🎉</b><p>Your request ID is <strong>{result}</strong>.</p><p className="muted">Keep this ID safe. You can use it to check the current status of your request.</p><Link href={`/status?id=${encodeURIComponent(result)}`}>Check Application Status →</Link></div></div>}
    </div>
  </section>;
}

export default function ApplyPage() { return <main>
  <header className="topbar"><div className="brand"><div className="logo">A</div><div><b>Aetasham Digital Seva</b><small>Private Digital Service Centre</small></div></div><nav><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/apply">Apply Online</Link><Link href="/status">Status</Link><Link href="/login">Login</Link></nav></header>
  <Suspense fallback={<section className="section"><div className="formbox"><p>Loading application form...</p></div></section>}><ApplyForm /></Suspense>
  <footer>Private digital assistance centre · Not an official government or CSC portal</footer>
</main>; }
