'use client';

import Link from 'next/link';

const categories = [
  {
    title: 'Identity & Citizen Services',
    items: [
      ['🪪', 'PAN Services', 'New PAN, correction and application assistance.', 'PAN'],
      ['🗳️', 'Voter Services', 'Voter application, correction and related assistance.', 'Voter'],
      ['🍚', 'Ration Card', 'New application, correction and family-detail assistance.', 'Ration Card'],
    ],
  },
  {
    title: 'Certificates & Schemes',
    items: [
      ['📜', 'Certificates', 'Birth, income, caste and other certificate assistance.', 'Certificate'],
      ['🏛️', 'Government Schemes', 'Application guidance and digital assistance for schemes.', 'Government Scheme'],
    ],
  },
  {
    title: 'Online & Document Services',
    items: [
      ['📝', 'Online Forms', 'Online form filling and submission assistance.', 'Online Form'],
      ['🖨️', 'Print & Documents', 'Printing, scanning and document preparation assistance.', 'Print & Documents'],
      ['💻', 'Other Digital Services', 'Help with common online services and requests.', 'Other'],
    ],
  },
];

export default function ServicesPage() {
  return <main>
    <header className="topbar">
      <div className="brand"><div className="logo">A</div><div><b>Aetasham Digital Seva</b><small>Private Digital Service Centre</small></div></div>
      <nav><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/apply">Apply Online</Link><Link href="/status">Status</Link><Link href="/login">Login</Link></nav>
    </header>

    <section className="section">
      <div className="heading"><div><span className="eyebrow">DIGITAL SERVICE CENTRE</span><h2>All Services</h2><p className="muted">Choose a service below and submit your request online.</p></div><Link className="primary" href="/apply">Start an Application →</Link></div>
      {categories.map(category => <div key={category.title} style={{ marginBottom: 36 }}>
        <h3 style={{ marginBottom: 16 }}>{category.title}</h3>
        <div className="grid">{category.items.map(([icon, title, desc, service]) => <article className="service" key={title}>
          <div className="serviceIcon">{icon}</div><h3>{title}</h3><p>{desc}</p><Link href={`/apply?service=${encodeURIComponent(service)}`}>Apply Now →</Link>
        </article>)}</div>
      </div>)}

      <div className="notice"><div><b>How it works</b><p>1. Select a service · 2. Submit your details · 3. Receive a request ID · 4. Track your application from the Status page.</p><Link href="/status">Track an Existing Request →</Link></div></div>
    </section>

    <footer><div><b>Aetasham Digital Seva</b><p>Private digital assistance centre.</p></div><div><b>Quick Links</b><p><Link href="/">Home</Link> · <Link href="/apply">Apply</Link> · <Link href="/status">Status</Link> · <Link href="/login">Login</Link></p></div><div><b>Disclaimer</b><p>Not an official government or CSC portal.</p></div></footer>
  </main>;
}
