'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMessage(''); setBusy(true);
    try {
      const response = await fetch(mode === 'signup' ? '/api/auth/register' : '/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to continue.');
      window.location.href = '/apply';
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to continue.'); }
    finally { setBusy(false); }
  }

  return <main>
    <header className="topbar"><Link href="/" className="brand"><div className="logo">A</div><div><b>Aetasham Digital Seva</b><small>Private Digital Service Centre</small></div></Link><nav><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/apply">Apply Online</Link><Link href="/status">Status</Link></nav></header>
    <section className="section"><div className="formbox" style={{maxWidth:480,margin:'25px auto'}}>
      <span className="eyebrow">CUSTOMER ACCOUNT</span><h2>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2>
      <p>Create an account or log in to use Aetasham Digital Seva.</p>
      <div style={{display:'flex',gap:8,margin:'20px 0'}}><button type="button" className={mode==='login'?'primary':'secondary'} onClick={()=>{setMode('login');setMessage('')}}>Login</button><button type="button" className={mode==='signup'?'primary':'secondary'} onClick={()=>{setMode('signup');setMessage('')}}>Sign up</button></div>
      <form onSubmit={submit}>
        {mode==='signup' && <label>Full name<input value={name} onChange={e=>setName(e.target.value)} required minLength={2} maxLength={80} autoComplete="name"/></label>}
        <label>Mobile number<input value={mobile} onChange={e=>setMobile(e.target.value.replace(/[^0-9]/g,'').slice(0,10))} inputMode="numeric" required pattern="[0-9]{10}" maxLength={10} autoComplete="tel" placeholder="10-digit mobile number"/></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={mode==='signup'?8:1} maxLength={128} autoComplete={mode==='signup'?'new-password':'current-password'} placeholder={mode==='signup'?'At least 8 characters':'Your password'}/></label>
        <button className="primary submitButton" disabled={busy}>{busy?'Please wait...':mode==='signup'?'Create account':'Login'}</button>
      </form>
      {message && <div className="notice errorNotice"><div><b>{message}</b></div></div>}
      <p className="note">Password is stored as a one-way hash. Mobile-number verification is not enabled yet; only use a number you control.</p>
      <p><Link href="/admin">Admin panel →</Link></p>
    </div></section>
    <footer>Private digital assistance centre · Not an official government or CSC portal</footer>
  </main>;
}
