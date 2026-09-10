'use client';

import Link from 'next/link';

const services = [
  ['🪪','PAN Services','PAN application and assistance.','PAN'],
  ['🗳️','Voter Services','Voter-related online application assistance.','Voter'],
  ['🍚','Ration Card','New application and correction assistance.','Ration Card'],
  ['📜','Certificates','Birth, income, caste and other certificate assistance.','Certificate'],
  ['🏛️','Government Schemes','Application guidance for eligible schemes.','Government Scheme'],
  ['📝','Online Forms','Online form filling and document assistance.','Online Form'],
  ['🖨️','Print & Documents','Printing, scanning and document services.','Print & Documents'],
  ['💻','Other Digital Services','Get help with common online services.','Other'],
];

export default function ServicesPage() {
  return <main>
    <header className="topbar"><div className="brand"><div className="logo">A</div><div><b>Aetasham Digital Seva</b><small>Private Digital Service Centre</small></div></div><nav><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/apply">Apply Online</Link><Link href="/status">Status</Link><Link href="/login">Login</Link></nav></header>
    <section className="section"><div className="heading"><div><span className="eyebrow">DIGITAL SERVICE CENTRE</span><h2>All Services</h2></div></div><div className="grid">{services.map(([icon,title,desc,service])=><article className="service" key={title}><div className="serviceIcon">{icon}</div><h3>{title}</h3><p>{desc}</p><Link href={`/apply?service=${encodeURIComponent(service)}`}>Apply Now →</Link></article>)}</div></section>
    <footer><div><b>Aetasham Digital Seva</b><p>Private digital assistance centre.</p></div><div><b>Quick Links</b><p><Link href="/">Home</Link> · <Link href="/status">Status</Link> · <Link href="/login">Login</Link></p></div><div><b>Disclaimer</b><p>Not an official government or CSC portal.</p></div></footer>
  </main>;
}
