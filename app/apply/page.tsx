'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

const options=['PAN','Voter','Ration Card','Certificate','Government Scheme','Online Form','Print & Documents','Other'];

export default function ApplyPage(){
 const params=useSearchParams(); const [service,setService]=useState(params.get('service')||''); const [name,setName]=useState(''); const [mobile,setMobile]=useState(''); const [details,setDetails]=useState(''); const [result,setResult]=useState('');
 function submit(e:FormEvent){e.preventDefault(); const id='ADS'+Date.now().toString().slice(-8); localStorage.setItem('ads_'+id,JSON.stringify({id,service,name,mobile,details,status:'Submitted',createdAt:new Date().toISOString()})); setResult(id); setName('');setMobile('');setDetails('');}
 return <main><header className="topbar"><div className="brand"><div className="logo">A</div><div><b>Aetasham Digital Seva</b><small>Private Digital Service Centre</small></div></div><nav><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/apply">Apply Online</Link><Link href="/status">Status</Link><Link href="/login">Login</Link></nav></header><section className="section"><div className="formbox"><span className="eyebrow">APPLICATION REQUEST</span><h2>Apply for a Service</h2><p className="muted">This form records a service request for private digital assistance.</p><form onSubmit={submit}><label>Service<select value={service} onChange={e=>setService(e.target.value)} required><option value="">Select service</option>{options.map(x=><option key={x}>{x}</option>)}</select></label><label>Applicant name<input value={name} onChange={e=>setName(e.target.value)} required maxLength={80}/></label><label>Mobile number<input value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,''))} inputMode="numeric" pattern="[0-9]{10}" maxLength={10} required/></label><label>Request details<textarea value={details} onChange={e=>setDetails(e.target.value)} rows={5} maxLength={500} placeholder="Tell us what service you need"/></label><button className="primary" type="submit">Submit Request</button></form>{result&&<div className="notice"><div><b>Request submitted!</b><p>Your request ID is <strong>{result}</strong>. Save it to check status.</p><Link href={`/status?id=${result}`}>Check Status →</Link></div></div>}</div></section><footer>Private digital assistance centre · Not an official government or CSC portal</footer></main>;
}
