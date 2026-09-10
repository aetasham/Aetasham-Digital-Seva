import Link from 'next/link';

const services = [
  ['🪪','PAN Services','New PAN, correction and application assistance','PAN'],
  ['🗳️','Voter Services','Voter registration, correction and status help','Voter'],
  ['🍚','Ration Card','Application, correction and status assistance','Ration Card'],
  ['📜','Certificates','Birth, income, caste and other certificate help','Certificate'],
  ['🏛️','Government Schemes','Information and online application assistance','Government Scheme'],
  ['📝','Online Forms','Form filling, print and document preparation','Online Form'],
  ['🖨️','Print & Documents','Print, scan, PDF and document services','Print & Documents'],
  ['🔎','Application Status','Track a submitted service request','STATUS'],
];

export default function Home() {
  return <main>
    <header className="topbar"><div className="brand"><div className="logo">A</div><div><b>Aetasham Digital Seva</b><small>Private Digital Service Centre</small></div></div><nav><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/apply">Apply Online</Link><Link href="/status">Status</Link><Link href="/login">Login</Link></nav></header>
    <section className="hero"><div className="heroText"><span className="pill">⚡ Fast • Simple • Digital</span><h1>Your Digital Seva,<br/><span>Made Simple.</span></h1><p>Get help with online forms, government-service applications, documents and digital services from one easy platform.</p><div className="actions"><Link className="primary" href="/services">Explore Services →</Link><Link className="secondary" href="/status">Track Application</Link></div><p className="note">A private digital assistance centre. Not an official government or CSC portal.</p></div><div className="heroCard"><div className="cardIcon">🧾</div><h3>Need online assistance?</h3><p>Select a service and submit your request.</p><Link className="primary" href="/apply">Start Application →</Link><div className="mini"><span>✓</span> Request tracking available</div><div className="mini"><span>✓</span> Mobile-friendly service</div></div></section>
    <section className="search"><div><b>What service do you need?</b><span>Search our digital services</span></div><input placeholder="🔍  Search PAN, voter, ration card, certificate..."/></section>
    <section className="section"><div className="heading"><div><span className="eyebrow">OUR SERVICES</span><h2>Popular Digital Services</h2></div><Link href="/services">View all →</Link></div><div className="grid">{services.map(([icon,title,desc,service])=><article className="service" key={title}><div className="serviceIcon">{icon}</div><h3>{title}</h3><p>{desc}</p>{service==='STATUS'?<Link href="/status">Check Now →</Link>:<Link href={`/apply?service=${encodeURIComponent(service)}`}>Apply Now →</Link>}</article>)}</div></section>
    <section className="status"><div><span className="eyebrow">TRACK REQUEST</span><h2>Check your application status</h2><p>Enter your request number to see the latest status.</p></div><div className="statusBox"><Link className="primary" href="/status">Open Status Checker →</Link></div></section>
    <section className="notice"><div className="noticeIcon">📢</div><div><b>Important Notice</b><p>Before submitting any application, keep your required documents ready. Service charges, if applicable, will be shown before confirmation.</p></div></section>
    <footer><div><b>Aetasham Digital Seva</b><p>Private digital assistance centre for online services.</p></div><div><b>Quick Links</b><p><Link href="/services">Services</Link> · <Link href="/apply">Apply</Link> · <Link href="/status">Status</Link> · <Link href="/admin">Admin</Link></p></div><div><b>Support</b><p>For assistance, contact your service centre.</p></div></footer>
  </main>;
}
