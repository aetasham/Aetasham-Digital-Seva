'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const services = [
  { icon: '🪪', title: 'PAN Card', description: 'New PAN, correction and application guidance.', category: 'Identity', value: 'PAN', fee: 'From ₹149' },
  { icon: '🗳️', title: 'Voter Services', description: 'Registration, correction and application assistance.', category: 'Identity', value: 'Voter' },
  { icon: '🍚', title: 'Ration Card', description: 'Application and correction assistance.', category: 'Citizen', value: 'Ration Card' },
  { icon: '📜', title: 'Certificates', description: 'Guidance for eligible certificates and applications.', category: 'Citizen', value: 'Certificate' },
  { icon: '🏛️', title: 'Government Schemes', description: 'Find scheme information and application support.', category: 'Government', value: 'Government Scheme' },
  { icon: '📝', title: 'Online Forms', description: 'Form filling and document preparation assistance.', category: 'Digital', value: 'Online Form' },
  { icon: '🖨️', title: 'Print & Documents', description: 'Printing, scanning and PDF assistance.', category: 'Digital', value: 'Print & Documents' },
  { icon: '💻', title: 'Other Services', description: 'Tell us what digital assistance you need.', category: 'Digital', value: 'Other' },
];

const steps = [
  ['01', 'Choose a service', 'Browse the service list and select the help you need.'],
  ['02', 'Submit your request', 'Share the required contact details and request information.'],
  ['03', 'Save your request ID', 'Use the unique ID to check progress at any time.'],
];

export default function Home() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => services.filter(s => (s.title + ' ' + s.description + ' ' + s.category).toLowerCase().includes(query.toLowerCase())), [query]);

  return <main className="siteShell">
    <div className="announcement"><span className="announcementDot" /> Online service requests are open <span className="announcementRight">Private digital assistance centre</span></div>
    <header className="topbar">
      <Link href="/" className="brand"><div className="logo">A</div><div><b>Aetasham</b><small>DIGITAL SEVA</small></div></Link>
      <nav><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/apply">Apply Online</Link><Link href="/status">Track Request</Link></nav>
      <div className="navActions"><Link className="loginLink" href="/login">Login</Link><Link className="navCta" href="/apply">Get Started <span>↗</span></Link></div>
    </header>

    <section className="premiumHero">
      <div className="heroGlow" />
      <div className="heroCopy">
        <div className="heroKicker"><span>✦</span> YOUR DIGITAL SERVICES, SIMPLIFIED</div>
        <h1>Everyday services.<br/><em>One simple place.</em></h1>
        <p>Get guided assistance for online forms, citizen services and digital documents — with a clear process from request to status tracking.</p>
        <div className="heroButtons"><Link className="heroPrimary" href="/services">Explore services <span>→</span></Link><Link className="heroSecondary" href="/status">Track an application</Link></div>
        <div className="heroTrust"><span>✓</span> Simple online requests <span>✓</span> Trackable application ID <span>✓</span> Mobile friendly</div>
      </div>
      <div className="heroVisual">
        <div className="visualOrb orbOne" /><div className="visualOrb orbTwo" />
        <div className="dashboardCard">
          <div className="dashTop"><div className="dashBrand"><span>A</span> Aetasham <i>● ● ●</i></div></div>
          <div className="dashWelcome"><small>WELCOME TO DIGITAL SEVA</small><b>How can we help<br/>you today?</b></div>
          <div className="dashTiles"><div><span>🪪</span><b>PAN Card</b><small>Apply online</small></div><div><span>📄</span><b>Certificates</b><small>Get assistance</small></div><div><span>🔎</span><b>Track request</b><small>Check status</small></div><div><span>🖨️</span><b>Documents</b><small>Print & scan</small></div></div>
          <div className="dashBottom"><span className="dashCheck">✓</span><div><b>One step at a time</b><small>Your request, organised.</small></div><span className="dashArrow">↗</span></div>
        </div>
        <div className="floatingTag"><span>✦</span><div><b>Easy to use</b><small>Designed for everyone</small></div></div>
      </div>
      <div className="heroBottomLabel">AETASHAM DIGITAL SEVA <span>·</span> ONLINE ASSISTANCE</div>
    </section>

    <section className="quickStrip">
      <div><span className="quickIcon">01</span><div><b>Choose</b><small>Find your service</small></div></div>
      <span className="quickLine" />
      <div><span className="quickIcon">02</span><div><b>Apply</b><small>Send a request</small></div></div>
      <span className="quickLine" />
      <div><span className="quickIcon">03</span><div><b>Track</b><small>Check progress</small></div></div>
      <Link href="/apply">Start now <span>→</span></Link>
    </section>

    <section className="premiumServices" id="services">
      <div className="sectionTop"><div><span className="sectionEyebrow">SERVICES MADE SIMPLE</span><h2>What do you need<br/><em>help with today?</em></h2></div><p>Explore popular digital assistance services. Select a category to get started with your request.</p></div>
      <div className="serviceSearch"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search services, e.g. PAN, voter, certificate..." /><kbd>SEARCH</kbd></div>
      <div className="premiumGrid">{filtered.map((s,i)=><article className="premiumServiceCard" key={s.value}><div className="serviceCardTop"><span className="premiumServiceIcon">{s.icon}</span><span className="serviceIndex">0{i+1}</span></div><div className="serviceCategory">{s.category.toUpperCase()}</div><h3>{s.title}</h3><p>{s.description}</p><div className="serviceCardBottom">{s.fee && <small>{s.fee}</small>}<Link href={`/apply?service=${encodeURIComponent(s.value)}`}>Apply now <span>↗</span></Link></div></article>)}</div>
      {filtered.length===0 && <div className="emptySearch">No matching services. Try a different search term.</div>}
      <div className="allServices"><span>Can’t find what you’re looking for?</span><Link href="/services">View all services <span>→</span></Link></div>
    </section>

    <section className="trackBanner"><div className="trackPattern" /><div><span className="sectionEyebrow">ALREADY APPLIED?</span><h2>Your request.<br/><em>Your peace of mind.</em></h2><p>Keep your application ID handy and check the latest status whenever you need.</p></div><Link href="/status">Track your request <span>↗</span></Link></section>

    <section className="howSection"><div className="sectionTop"><div><span className="sectionEyebrow">HOW IT WORKS</span><h2>Simple from<br/><em>start to finish.</em></h2></div><p>A straightforward process to help you get the digital assistance you need.</p></div><div className="stepsGrid">{steps.map(([n,title,desc])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></section>

    <section className="disclaimer"><span>ⓘ</span><p><b>Please note:</b> Aetasham Digital Seva is a private digital assistance service and is not an official government website or CSC portal. Government applications and approvals are subject to the relevant department’s rules.</p></section>

    <footer className="premiumFooter"><div className="footerMain"><div><Link href="/" className="brand footerBrand"><div className="logo">A</div><div><b>Aetasham</b><small>DIGITAL SEVA</small></div></Link><p>Digital assistance, made simpler.<br/>A clear and convenient way to request help.</p></div><div><b>Explore</b><Link href="/services">All services</Link><Link href="/apply">Apply online</Link><Link href="/status">Track request</Link></div><div><b>Your account</b><Link href="/login">Login / Sign up</Link><Link href="/admin">Admin panel</Link></div><div><b>Support</b><a href="https://wa.me/?text=Hello%20Aetasham%20Digital%20Seva" target="_blank" rel="noreferrer">WhatsApp support ↗</a><span>Contact number can be configured in settings.</span></div></div><div className="footerEnd"><span>© {new Date().getFullYear()} Aetasham Digital Seva</span><span>Private service · Not affiliated with any government department</span></div></footer>
  </main>;
}
