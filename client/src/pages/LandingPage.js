import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ── Animated counter hook ──────────────────────────────────────────────────
function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

// ── Feature card data ──────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: '📋',
    title: 'Kanban Boards',
    desc: 'Drag-and-drop task management with Todo, In Progress, and Done columns. Assign tasks to teammates and track progress in real time.',
    color: '#3b5bdb',
  },
  {
    icon: '💬',
    title: 'Real-time Chat',
    desc: 'Project-scoped messaging powered by Socket.io. Every message is persisted and synced instantly across all connected members.',
    color: '#7c3aed',
  },
  {
    icon: '📝',
    title: 'Collaborative Notes',
    desc: 'Rich note editor with auto-save. Create, edit, and organize project documentation that the whole team can access.',
    color: '#059669',
  },
  {
    icon: '🎨',
    title: 'Shared Whiteboard',
    desc: 'Draw, sketch, and brainstorm together on a live canvas. Supports pen, shapes, and eraser tools with real-time sync.',
    color: '#d97706',
  },
  {
    icon: '👥',
    title: 'Team Invitations',
    desc: 'Invite collaborators by email. Accept or decline invitations from your dashboard and jump straight into the project.',
    color: '#db2777',
  },
  {
    icon: '🔒',
    title: 'Secure by Default',
    desc: 'JWT authentication, HTTP-only cookies, bcrypt password hashing, and role-based project access control built in.',
    color: '#0891b2',
  },
];

// ── Testimonials ───────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Alex R.', role: 'Engineering Lead', text: 'Synapse replaced three separate tools for our team. The real-time whiteboard alone is worth it.' },
  { name: 'Priya M.', role: 'Product Manager', text: 'The Kanban board is snappy and the chat keeps everyone in context. Onboarding took minutes.' },
  { name: 'Jordan K.', role: 'Freelance Developer', text: 'I use Synapse for every client project. The invitation flow is seamless and the UI is clean.' },
];

// ── Main component ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={s.page}>
      {/* ── Navbar ── */}
      <nav style={{ ...s.nav, ...(scrolled ? s.navScrolled : {}) }}>
        <div style={s.navInner}>
          <div style={s.logo}>
            <div style={s.logoIcon}>S</div>
            <span style={s.logoText}>Synapse</span>
          </div>
          <div style={s.navLinks}>
            <a href="#features" style={s.navLink}>Features</a>
            <a href="#testimonials" style={s.navLink}>Reviews</a>
            <Link to="/about" style={s.navLink}>About</Link>
            <Link to="/login" style={s.navLink}>Sign in</Link>
            <Link to="/signup" style={s.navCta}>Get started free</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={s.hero}>
        {/* Background glow blobs */}
        <div style={s.blob1} />
        <div style={s.blob2} />

        <div style={s.heroContent}>
          <div style={s.badge}>✦ Now with real-time collaboration</div>
          <h1 style={s.heroTitle}>
            Your team's second<br />
            <span style={s.heroGradient}>brain, built together</span>
          </h1>
          <p style={s.heroSub}>
            Synapse combines Kanban boards, live chat, shared notes, and a collaborative
            whiteboard into one focused workspace — no context switching required.
          </p>
          <div style={s.heroCtas}>
            <Link to="/signup" style={s.ctaPrimary}>Start for free →</Link>
            <Link to="/login" style={s.ctaSecondary}>Sign in</Link>
          </div>
          <p style={s.heroNote}>No credit card required · Free forever for small teams</p>
        </div>

        {/* Hero mockup card */}
        <div style={s.heroCard}>
          <MockupCard />
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={s.stats}>
        <StatItem value={12000} suffix="+" label="Active projects" />
        <div style={s.statDivider} />
        <StatItem value={48000} suffix="+" label="Tasks completed" />
        <div style={s.statDivider} />
        <StatItem value={3200} suffix="+" label="Teams onboarded" />
        <div style={s.statDivider} />
        <StatItem value={99} suffix="%" label="Uptime SLA" />
      </section>

      {/* ── Features ── */}
      <section id="features" style={s.section}>
        <div style={s.sectionInner}>
          <p style={s.sectionEyebrow}>Everything you need</p>
          <h2 style={s.sectionTitle}>One workspace, every tool</h2>
          <p style={s.sectionSub}>
            Stop juggling tabs. Synapse brings your entire project workflow into a single,
            fast, real-time environment.
          </p>
          <div style={s.featureGrid}>
            {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ ...s.section, background: '#0d1120' }}>
        <div style={s.sectionInner}>
          <p style={s.sectionEyebrow}>Simple workflow</p>
          <h2 style={s.sectionTitle}>Up and running in minutes</h2>
          <div style={s.stepsRow}>
            <Step n="01" title="Create a project" desc="Name your project, pick a color, and you're in. No setup wizard, no configuration files." />
            <div style={s.stepArrow}>→</div>
            <Step n="02" title="Invite your team" desc="Send email invitations. Teammates accept from their dashboard and join the project instantly." />
            <div style={s.stepArrow}>→</div>
            <Step n="03" title="Collaborate live" desc="Use the Kanban board, chat, notes, and whiteboard — all synced in real time via Socket.io." />
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" style={s.section}>
        <div style={s.sectionInner}>
          <p style={s.sectionEyebrow}>What people say</p>
          <h2 style={s.sectionTitle}>Teams love Synapse</h2>
          <div style={s.testimonialGrid}>
            {TESTIMONIALS.map(t => <TestimonialCard key={t.name} {...t} />)}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={s.ctaBanner}>
        <div style={s.ctaBannerBlob} />
        <h2 style={s.ctaBannerTitle}>Ready to build something together?</h2>
        <p style={s.ctaBannerSub}>Join thousands of teams already using Synapse to ship faster.</p>
        <Link to="/signup" style={s.ctaPrimary}>Create your workspace →</Link>
      </section>

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.logo}>
            <div style={s.logoIcon}>S</div>
            <span style={s.logoText}>Synapse</span>
          </div>
          <p style={s.footerNote}>© {new Date().getFullYear()} Synapse. Built for teams that move fast.</p>
          <div style={s.footerLinks}>
            <Link to="/login" style={s.footerLink}>Sign in</Link>
            <Link to="/signup" style={s.footerLink}>Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StatItem({ value, suffix, label }) {
  const count = useCounter(value);
  return (
    <div style={s.statItem}>
      <span style={s.statValue}>{count.toLocaleString()}{suffix}</span>
      <span style={s.statLabel}>{label}</span>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...s.featureCard,
        borderColor: hovered ? color : '#1e2535',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? `0 12px 32px rgba(0,0,0,.4)` : '0 2px 8px rgba(0,0,0,.2)',
      }}
    >
      <div style={{ ...s.featureIcon, background: `${color}22`, color }}>{icon}</div>
      <h3 style={s.featureTitle}>{title}</h3>
      <p style={s.featureDesc}>{desc}</p>
    </div>
  );
}

function Step({ n, title, desc }) {
  return (
    <div style={s.step}>
      <div style={s.stepNum}>{n}</div>
      <h3 style={s.stepTitle}>{title}</h3>
      <p style={s.stepDesc}>{desc}</p>
    </div>
  );
}

function TestimonialCard({ name, role, text }) {
  return (
    <div style={s.testimonialCard}>
      <p style={s.testimonialText}>"{text}"</p>
      <div style={s.testimonialAuthor}>
        <div style={s.testimonialAvatar}>{name[0]}</div>
        <div>
          <p style={s.testimonialName}>{name}</p>
          <p style={s.testimonialRole}>{role}</p>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard mockup inside hero ───────────────────────────────────────────
function MockupCard() {
  return (
    <div style={s.mockup}>
      {/* Mockup header */}
      <div style={s.mockupHeader}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ef4444', '#f59e0b', '#10b981'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={s.mockupTitle}>Synapse — Project Alpha</div>
      </div>
      {/* Mockup tabs */}
      <div style={s.mockupTabs}>
        {['📋 Kanban', '💬 Chat', '📝 Notes'].map((t, i) => (
          <div key={t} style={{ ...s.mockupTab, ...(i === 0 ? s.mockupTabActive : {}) }}>{t}</div>
        ))}
      </div>
      {/* Mockup kanban columns */}
      <div style={s.mockupBody}>
        {[
          { label: 'Todo', color: '#64748b', tasks: ['Design system audit', 'API rate limiting'] },
          { label: 'In Progress', color: '#3b5bdb', tasks: ['Auth module', 'Socket events'] },
          { label: 'Done', color: '#059669', tasks: ['DB schema', 'JWT setup'] },
        ].map(col => (
          <div key={col.label} style={s.mockupCol}>
            <div style={{ ...s.mockupColLabel, color: col.color }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: col.color, display: 'inline-block', marginRight: 6 }} />
              {col.label}
            </div>
            {col.tasks.map(t => (
              <div key={t} style={s.mockupTask}>{t}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s = {
  page: { minHeight: '100vh', background: '#0f1117', color: '#e2e8f0', overflowX: 'hidden' },

  // Navbar
  nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'background .2s, border-color .2s', borderBottom: '1px solid transparent', padding: '0 24px' },
  navScrolled: { background: 'rgba(15,17,23,.92)', backdropFilter: 'blur(12px)', borderBottomColor: '#1e2535' },
  navInner: { maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoIcon: { width: 36, height: 36, background: '#3b5bdb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 },
  logoText: { fontSize: 20, fontWeight: 700, color: '#fff' },
  navLinks: { display: 'flex', alignItems: 'center', gap: 28 },
  navLink: { color: '#94a3b8', fontSize: 14, textDecoration: 'none', fontWeight: 500, transition: 'color .15s' },
  navCta: { background: '#3b5bdb', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'background .15s' },

  // Hero
  hero: { position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', overflow: 'hidden', textAlign: 'center' },
  blob1: { position: 'absolute', top: '10%', left: '15%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,91,219,.18) 0%, transparent 70%)', pointerEvents: 'none' },
  blob2: { position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,.14) 0%, transparent 70%)', pointerEvents: 'none' },
  heroContent: { position: 'relative', zIndex: 2, maxWidth: 720 },
  badge: { display: 'inline-block', background: 'rgba(59,91,219,.15)', border: '1px solid rgba(59,91,219,.35)', color: '#818cf8', fontSize: 13, fontWeight: 500, padding: '6px 16px', borderRadius: 20, marginBottom: 28 },
  heroTitle: { fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 24 },
  heroGradient: { background: 'linear-gradient(135deg, #3b5bdb 0%, #7c3aed 50%, #db2777 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  heroSub: { fontSize: 18, color: '#94a3b8', lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' },
  heroCtas: { display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 },
  ctaPrimary: { background: '#3b5bdb', color: '#fff', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none', transition: 'background .15s, transform .15s', display: 'inline-block' },
  ctaSecondary: { background: '#1e2535', color: '#e2e8f0', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1px solid #2d3348', display: 'inline-block' },
  heroNote: { fontSize: 13, color: '#4a5568', marginTop: 16 },
  heroCard: { position: 'relative', zIndex: 2, marginTop: 64, width: '100%', maxWidth: 780 },

  // Stats
  stats: { background: '#161b27', borderTop: '1px solid #1e2535', borderBottom: '1px solid #1e2535', padding: '36px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0, flexWrap: 'wrap' },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 48px' },
  statValue: { fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' },
  statLabel: { fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: 500 },
  statDivider: { width: 1, height: 48, background: '#1e2535' },

  // Sections
  section: { padding: '96px 24px' },
  sectionInner: { maxWidth: 1100, margin: '0 auto' },
  sectionEyebrow: { fontSize: 12, fontWeight: 700, color: '#3b5bdb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, textAlign: 'center' },
  sectionTitle: { fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 16, letterSpacing: '-0.02em' },
  sectionSub: { fontSize: 16, color: '#64748b', textAlign: 'center', maxWidth: 560, margin: '0 auto 56px', lineHeight: 1.7 },

  // Feature grid
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 },
  featureCard: { background: '#161b27', borderRadius: 16, border: '1px solid #1e2535', padding: 28, transition: 'all .2s', cursor: 'default' },
  featureIcon: { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 18 },
  featureTitle: { fontSize: 17, fontWeight: 700, color: '#e2e8f0', marginBottom: 10 },
  featureDesc: { fontSize: 14, color: '#64748b', lineHeight: 1.7 },

  // Steps
  stepsRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginTop: 56 },
  step: { flex: '1 1 220px', maxWidth: 280, textAlign: 'center', padding: '0 12px' },
  stepNum: { fontSize: 13, fontWeight: 700, color: '#3b5bdb', letterSpacing: '0.08em', marginBottom: 14 },
  stepTitle: { fontSize: 18, fontWeight: 700, color: '#e2e8f0', marginBottom: 10 },
  stepDesc: { fontSize: 14, color: '#64748b', lineHeight: 1.7 },
  stepArrow: { fontSize: 24, color: '#2d3348', alignSelf: 'center', flexShrink: 0, paddingTop: 8 },

  // Testimonials
  testimonialGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginTop: 48 },
  testimonialCard: { background: '#161b27', borderRadius: 16, border: '1px solid #1e2535', padding: 28 },
  testimonialText: { fontSize: 15, color: '#94a3b8', lineHeight: 1.7, marginBottom: 24, fontStyle: 'italic' },
  testimonialAuthor: { display: 'flex', alignItems: 'center', gap: 12 },
  testimonialAvatar: { width: 40, height: 40, borderRadius: '50%', background: '#2d3348', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: 700, fontSize: 16, flexShrink: 0 },
  testimonialName: { fontSize: 14, fontWeight: 600, color: '#e2e8f0' },
  testimonialRole: { fontSize: 12, color: '#64748b', marginTop: 2 },

  // CTA Banner
  ctaBanner: { position: 'relative', background: 'linear-gradient(135deg, #1a2040 0%, #1a1030 100%)', border: '1px solid #2d3348', margin: '0 24px 80px', borderRadius: 24, padding: '72px 24px', textAlign: 'center', overflow: 'hidden' },
  ctaBannerBlob: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,91,219,.2) 0%, transparent 70%)', pointerEvents: 'none' },
  ctaBannerTitle: { fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: 16, position: 'relative' },
  ctaBannerSub: { fontSize: 16, color: '#64748b', marginBottom: 36, position: 'relative' },

  // Footer
  footer: { borderTop: '1px solid #1e2535', padding: '32px 24px' },
  footerInner: { maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 },
  footerNote: { fontSize: 13, color: '#4a5568' },
  footerLinks: { display: 'flex', gap: 20 },
  footerLink: { fontSize: 13, color: '#64748b', textDecoration: 'none' },

  // Mockup
  mockup: { background: '#161b27', border: '1px solid #1e2535', borderRadius: 16, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,.6)', textAlign: 'left' },
  mockupHeader: { background: '#1a1f2e', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #1e2535' },
  mockupTitle: { fontSize: 12, color: '#64748b', fontWeight: 500 },
  mockupTabs: { display: 'flex', gap: 0, borderBottom: '1px solid #1e2535', background: '#161b27', padding: '0 16px' },
  mockupTab: { padding: '10px 14px', fontSize: 12, color: '#64748b', cursor: 'default', borderBottom: '2px solid transparent' },
  mockupTabActive: { color: '#3b5bdb', borderBottomColor: '#3b5bdb' },
  mockupBody: { display: 'flex', gap: 12, padding: 16, overflowX: 'auto' },
  mockupCol: { flex: '1 1 160px', minWidth: 140 },
  mockupColLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, display: 'flex', alignItems: 'center' },
  mockupTask: { background: '#1a1f2e', border: '1px solid #1e2535', borderRadius: 8, padding: '10px 12px', marginBottom: 8, fontSize: 12, color: '#94a3b8' },
};
