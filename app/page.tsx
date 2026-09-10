const services = [
  ['🪪','PAN Services','New PAN, correction and application assistance'],
  ['🗳️','Voter Services','Voter registration, correction and status help'],
  ['🍚','Ration Card','Application, correction and status assistance'],
  ['📜','Certificates','Birth, income, caste and other certificate help'],
  ['🏛️','Government Schemes','Information and online application assistance'],
  ['📝','Online Forms','Form filling, print and document preparation'],
  ['🖨️','Print & Documents','Print, scan, PDF and document services'],
  ['🔎','Application Status','Track a submitted service request'],
];

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <div className="brand"><div className="logo">A</div><div><b>Aetasham Digital Seva</b><small>Private Digital Service Centre</small></div></div>
        <nav><a href="#home">Home</a><a href="#services">Services</a><a href="#apply">Apply Online</a><a href="#status">Status</a><a href="#login">Login</a></nav>
      </header>

      <section id="home" className="hero">
        <div className="heroText">
          <span className="pill">⚡ Fast • Simple • Digital</span>
          <h1>Your Digital Seva,<br/><span>Made Simple.</span></h1>
          <p>Get help with online forms, government-service applications, documents and digital services from one easy platform.</p>
          <div className="actions"><a className="primary" href="#services">Explore Services →</a><a className="secondary" href="#status">Track Application</a></div>
          <p className="note">A private digital assistance centre. Not an official government or CSC portal.</p>
        </div>
        <div className="heroCard"><div className="cardIcon">🧾</div><h3>Need online assistance?</h3><p>Select a service and submit your request.</p><button>Start Application →</button><div className="mini"><span>✓</span> Request tracking available</div><div className="mini"><span>✓</span> Mobile-friendly service</div></div>
      </section>

      <section className="search"><div><b>What service do you need?</b><span> Search our digital services</span></div><input placeholder="🔍  Search PAN, voter, ration card, certificate..."/></section>

      <section id="services" className="section"><div className="heading"><div><span className="eyebrow">OUR SERVICES</span><h2>Popular Digital Services</h2></div><a href="#services">View all →</a></div><div className="grid">{services.map(([icon,title,desc]) => <article className="service" key={title}><div className="serviceIcon">{icon}</div><h3>{title}</h3><p>{desc}</p><a href="#apply">Apply Now →</a></article>)}</div></section>

      <section id="status" className="status"><div><span className="eyebrow">TRACK REQUEST</span><h2>Check your application status</h2><p>Enter your request number to see the latest status.</p></div><div className="statusBox"><input placeholder="Enter application number"/><button>Check Status</button></div></section>

      <section id="apply" className="notice"><div className="noticeIcon">📢</div><div><b>Important Notice</b><p>Before submitting any application, keep your required documents ready. Service charges, if applicable, will be shown before confirmation.</p></div></section>

      <footer id="login"><div><b>Aetasham Digital Seva</b><p>Private digital assistance centre for online services.</p></div><div><b>Quick Links</b><p>Services · Apply Online · Status · Help</p></div><div><b>Support</b><p>For assistance, contact your service centre.</p></div></footer>
    </main>
  );
}
