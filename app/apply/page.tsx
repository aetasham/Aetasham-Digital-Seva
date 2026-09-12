'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useEffect, useMemo, useState } from 'react';

const services = [
  { value: 'PAN', label: 'PAN Services', icon: '🪪', docs: ['Aadhaar / identity proof', 'Address proof', 'Passport-size photo'], fee: 149 },
  { value: 'Voter', label: 'Voter Services', icon: '🗳️', docs: ['Identity proof', 'Address proof', 'Date of birth proof'] },
  { value: 'Ration Card', label: 'Ration Card', icon: '🍚', docs: ['Identity proof', 'Address proof', 'Family details'] },
  { value: 'Certificate', label: 'Certificates', icon: '📜', docs: ['Identity proof', 'Address proof', 'Supporting documents as applicable'] },
  { value: 'Government Scheme', label: 'Government Schemes', icon: '🏛️', docs: ['Identity proof', 'Bank details if applicable', 'Scheme-specific documents'] },
  { value: 'Online Form', label: 'Online Forms', icon: '📝', docs: ['Relevant identity proof', 'Required supporting documents'] },
  { value: 'Print & Documents', label: 'Print & Documents', icon: '🖨️', docs: ['Digital file or document to print/scan'] },
  { value: 'Other', label: 'Other Digital Services', icon: '💻', docs: ['Documents relevant to your request'] },
];

declare global { interface Window { Razorpay: any; } }

function ApplyForm() {
  const params = useSearchParams();
  const [service, setService] = useState(params.get('service') || '');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [details, setDetails] = useState('');
  const [consent, setConsent] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => { setService(params.get('service') || ''); }, [params]);

  const selected = useMemo(() => services.find(item => item.value === service), [service]);

  async function payForPan() {
    setError('');
    if (!result || !selected?.fee) return;
    if (!window.Razorpay) return setError('Payment system is still loading. Please try again.');
    setPaying(true);
    try {
      const orderResponse = await fetch('/api/payments/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: selected.fee * 100, receipt: result }) });
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order.error || 'Unable to start payment.');
      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Aetasham Digital Seva',
        description: 'PAN service assistance',
        order_id: order.id,
        prefill: { name, email, contact: mobile },
        notes: { application_id: result },
        theme: { color: '#0f766e' },
        handler: () => setError('Payment received by Razorpay. Keep the payment confirmation for your records.'),
        modal: { ondismiss: () => setPaying(false) },
      });
      razorpay.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start payment.');
    } finally {
      setPaying(false);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setResult('');
    if (!service) return setError('Please select a service.');
    if (!/^[0-9]{10}$/.test(mobile)) return setError('Please enter a valid 10-digit mobile number.');
    if (!/^[0-9]{6}$/.test(pincode)) return setError('Please enter a valid 6-digit PIN code.');
    if (!consent) return setError('Please confirm the information and consent before submitting.');
    setSaving(true);
    try {
      const requestDetails = [
        `Email: ${email.trim() || 'Not provided'}`,
        `Date of birth: ${dob || 'Not provided'}`,
        `Address: ${address.trim()}`,
        `PIN code: ${pincode}`,
        `Request: ${details.trim() || 'Not provided'}`,
      ].join('\n');
      const response = await fetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ service, name: name.trim(), mobile, details: requestDetails }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to submit application.');
      setResult(data.id);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to submit application.'); }
    finally { setSaving(false); }
  }

  return <section className="section applyPage">
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
    <div className="applyHero"><div><span className="eyebrow">DIGITAL SEVA CENTRE</span><h1>Apply for a Service</h1><p>Complete the application below. Your request will receive a unique application ID after successful submission.</p></div><div className="stepBox"><b>Application Process</b><span>1. Fill details</span><span>2. Submit request</span><span>3. Track status</span></div></div>
    <div className="applyLayout">
      <div className="formbox">
        <div className="formHeader"><div><span className="eyebrow">STEP 1</span><h2>Applicant Details</h2></div><span className="requiredNote">* Required</span></div>
        <form onSubmit={submit}>
          <div className="formSection"><h3>Service Selection</h3><label>Choose service *<select value={service} onChange={e => setService(e.target.value)} required><option value="">Select a service</option>{services.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>{selected && <div className="serviceHint">{selected.icon} <b>{selected.label}</b><span> — application assistance</span></div>}</div>
          <div className="formSection"><h3>Personal Information</h3><div className="formGrid"><label>Applicant full name *<input value={name} onChange={e => setName(e.target.value)} required maxLength={80} placeholder="Enter full name" /></label><label>Mobile number *<input value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" pattern="[0-9]{10}" maxLength={10} required placeholder="10-digit mobile number" /></label><label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} maxLength={120} placeholder="Optional email address" /></label><label>Date of birth<input type="date" value={dob} onChange={e => setDob(e.target.value)} /></label></div></div>
          <div className="formSection"><h3>Address</h3><div className="formGrid"><label className="full">Full address *<textarea value={address} onChange={e => setAddress(e.target.value)} required maxLength={300} rows={3} placeholder="House / street / village / town" /></label><label>PIN code *<input value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required placeholder="6-digit PIN code" /></label></div></div>
          <div className="formSection"><h3>Request Details</h3><label>Tell us what assistance you need<textarea value={details} onChange={e => setDetails(e.target.value)} maxLength={500} rows={4} placeholder="Mention the application, correction, form or digital service you need" /></label></div>
          <div className="formSection"><h3>Before You Submit</h3><div className="checklist">{(selected?.docs || ['Relevant documents']).map(doc => <span key={doc}>✓ {doc}</span>)}</div><label className="consent"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} /> <span>I confirm that the information provided is accurate and I understand this is a private digital assistance service.</span></label></div>
          <button className="primary submitButton" type="submit" disabled={saving}>{saving ? 'Submitting Application...' : 'Submit Application →'}</button>
        </form>
        {error && <div className="notice errorNotice"><div><b>Notice</b><p>{error}</p></div></div>}
        {result && <div className="notice successNotice"><div><b>Application submitted successfully 🎉</b><p>Your Application ID is <strong>{result}</strong></p><p className="muted">Save this ID to track your application status.</p>{selected?.fee ? <><p><strong>PAN Service Total: ₹{selected.fee}</strong><br />Official fee ₹107 + Digital Seva service charge ₹42</p><button className="primary" type="button" onClick={payForPan} disabled={paying}>{paying ? 'Opening Payment...' : 'Pay ₹149 with Razorpay →'}</button></> : null}<br /><Link href={`/status?id=${encodeURIComponent(result)}`}>Track Application →</Link></div></div>}
      </div>
      <aside className="applySide"><div className="sideCard"><span className="eyebrow">DOCUMENT GUIDE</span><h3>Keep documents ready</h3><p>Requirements can vary by service. The centre may request additional documents when reviewing your application.</p><ul>{(selected?.docs || ['Identity proof', 'Address proof', 'Service-specific documents']).map(doc => <li key={doc}>✓ {doc}</li>)}</ul></div><div className="sideCard"><span className="eyebrow">NEED HELP?</span><h3>Not sure which service to choose?</h3><p>Choose the closest service and explain your requirement in Request Details. The centre can review it.</p><Link href="/services">View All Services →</Link></div><div className="sideCard privacyCard"><b>🔒 Privacy</b><p>Only provide information needed for your service request. Do not enter passwords, OTPs, PINs or payment-card details.</p></div></aside>
    </div>
  </section>;
}

export default function ApplyPage() { return <main><header className="topbar"><div className="brand"><div className="logo">A</div><div><b>Aetasham Digital Seva</b><small>Private Digital Service Centre</small></div></div><nav><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/apply">Apply Online</Link><Link href="/status">Status</Link><Link href="/login">Login</Link></nav></header><Suspense fallback={<section className="section"><div className="formbox"><p>Loading application form...</p></div></section>}><ApplyForm /></Suspense><footer>Private digital assistance centre · Not an official government or CSC portal</footer></main>; }
