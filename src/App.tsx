import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, MapPin, Menu, X } from "lucide-react";
import heroImage from "./assets/hero-campus.png";
import residenceImage from "./assets/residence.png";
import hillsideImage from "./assets/hillside.png";
import EnquiryChat from "./components/EnquiryChat";

const ease = [0.22, 1, 0.36, 1] as const;

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Meridian Build home">
      <svg viewBox="0 0 44 44" aria-hidden="true"><path d="M4 36V8h7l11 14L33 8h7v28h-8V20L22 33 12 20v16H4Z" /></svg>
      <span><strong>MERIDIAN</strong><small>BUILD</small></span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const update = () => setSolid(window.scrollY > 50);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <header className={`header ${solid ? "is-solid" : ""}`}>
      <Logo />
      <nav className="nav" aria-label="Main navigation">
        <a href="#projects">Projects</a><a href="#services">Expertise</a><a href="#company">Company</a>
      </nav>
      <a className="nav-cta" href="#contact">Discuss a project <ArrowUpRight size={15} /></a>
      <button className="menu-trigger" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></button>
      <AnimatePresence>
        {menuOpen && (
          <motion.aside className="menu" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: .5, ease }}>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
            <Logo />
            <nav>
              {[["Projects", "#projects"], ["Expertise", "#services"], ["Company", "#company"], ["Discuss a project", "#contact"]].map(([label, href]) => (
                <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}<ArrowRight /></a>
              ))}
            </nav>
            <p>Road No. 36, Jubilee Hills<br />Hyderabad, Telangana</p>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .72, delay, ease }}>{children}</motion.div>;
}

function App() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <main id="top">
      <Header />
      <section className="hero" ref={heroRef}>
        <motion.img src={heroImage} alt="Meridian Build commercial campus in Hyderabad's Financial District" style={{ scale: imageScale }} />
        <div className="hero-blue" />
        <motion.div className="hero-content" style={{ y: titleY }}>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15, duration: .7 }}>HYDERABAD · TELANGANA</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25, duration: 1, ease }}>MERIDIAN</motion.h1>
          <motion.div className="hero-lower" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8, duration: .8 }}>
            <h2>Clarity,<br />built in.</h2>
            <div><p>Precision-led construction for Hyderabad’s homes, workplaces and next landmarks.</p><a href="#projects">View selected work <ArrowDown size={16} /></a></div>
          </motion.div>
        </motion.div>
        <div className="hero-index">01 / 04</div>
      </section>

      <section className="intro" id="company">
        <div className="section-label">01 — WHO WE ARE</div>
        <Reveal className="intro-copy">
          <h2>We turn ambitious plans into <em>well-built places.</em></h2>
          <p>Meridian is a Hyderabad construction practice combining experienced site leadership, transparent commercial control and exacting finish quality.</p>
        </Reveal>
        <div className="metrics">
          <div><strong>22</strong><span>Years of practice</span></div>
          <div><strong>61</strong><span>Completed projects</span></div>
          <div><strong>94%</strong><span>On-time delivery</span></div>
        </div>
      </section>

      <section className="projects" id="projects">
        <div className="project-head"><span>02 — SELECTED PROJECTS</span><h2>Built across<br />the city.</h2></div>
        <article className="feature-project">
          <Reveal className="feature-image"><img src={hillsideImage} alt="Meridian House, Jubilee Hills" /></Reveal>
          <div className="project-copy"><span>RESIDENTIAL · 2025</span><h3>Meridian House</h3><p>Jubilee Hills, Hyderabad</p><a href="#contact">Project enquiry <ArrowUpRight size={18} /></a></div>
        </article>
        <article className="secondary-project">
          <div className="project-copy"><span>RESIDENTIAL · 2024</span><h3>Blue Court</h3><p>Banjara Hills, Hyderabad</p><a href="#contact">Project enquiry <ArrowUpRight size={18} /></a></div>
          <Reveal className="secondary-image"><img src={residenceImage} alt="Blue Court residence, Banjara Hills" /></Reveal>
        </article>
      </section>

      <section className="services" id="services">
        <div className="section-label white">03 — WHAT WE DO</div>
        <Reveal className="services-title"><h2>One partner.<br />Every phase.</h2><p>Rigour in planning. Clarity on site. Accountability through handover.</p></Reveal>
        <div className="service-list">
          {[
            ["01", "Pre-construction", "Site due diligence · Cost planning · Value engineering"],
            ["02", "General contracting", "Civil works · MEP coordination · Quality systems"],
            ["03", "Design + build", "Architecture management · Interiors · Landscape"],
            ["04", "Project delivery", "Schedule control · Reporting · Handover support"],
          ].map(([n, title, detail], i) => (
            <Reveal className="service" key={n} delay={i * .05}><span>{n}</span><h3>{title}</h3><p>{detail}</p><ArrowRight /></Reveal>
          ))}
        </div>
      </section>

      <section className="standard">
        <div className="standard-side"><MapPin size={18} /><span>17.4239° N<br />78.4738° E</span></div>
        <Reveal className="standard-copy"><span>THE MERIDIAN STANDARD</span><h2>Measured twice.<br /><em>Built once.</em></h2><p>Every milestone is documented, every material approved and every detail checked before it disappears behind the finish.</p></Reveal>
      </section>

      <section className="contact" id="contact">
        <p>04 — START A CONVERSATION</p>
        <h2>Have a site?<br /><span>Let’s talk.</span></h2>
        <a href="mailto:projects@meridianbuild.in">projects@meridianbuild.in <ArrowUpRight /></a>
      </section>

      <footer>
        <Logo />
        <p>Level 3, Plot 714, Road No. 36<br />Jubilee Hills, Hyderabad 500033</p>
        <div><a href="tel:+914047151900">+91 40 4715 1900</a><a href="#top">Back to top ↑</a></div>
        <span>© 2026 Meridian Build</span>
      </footer>
      <EnquiryChat />
    </main>
  );
}

export default App;
