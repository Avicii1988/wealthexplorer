import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function AboutPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#e8e8e6' }}>

      {/* ── NAV ── */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link to="/" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#c9a84c', fontSize: '13px', letterSpacing: '0.26em', textTransform: 'uppercase', fontWeight: 400 }}>
            Wealth Explorer
          </Link>
          <Link to="/" className="text-[11px] text-white/50 hover:text-[#c9a84c] transition-colors tracking-wide">
            ← Back
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="pt-20 pb-14 px-5 text-center">
        <p className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: '#c9a84c' }}>About Us</p>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 6vw, 48px)', fontWeight: 400, color: '#fff', letterSpacing: '0.02em', lineHeight: 1.15 }}>
          The World's Wealth,<br />Explored
        </h1>
        <div className="w-10 h-px mx-auto mt-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)' }} />
      </section>

      {/* ── CONTENT ── */}
      <main className="max-w-2xl mx-auto px-5 pb-20 space-y-14">

        {/* Mission */}
        <section>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '22px', color: '#c9a84c', fontWeight: 400, marginBottom: '16px' }}>
            Our Mission
          </h2>
          <p className="text-[14px] text-white/70 leading-relaxed mb-4">
            Wealth Explorer is the world's most comprehensive public directory of celebrity net worth, assets, and lifestyles. We believe financial transparency empowers people — and that curiosity about how the ultra-wealthy live is entirely natural.
          </p>
          <p className="text-[14px] text-white/70 leading-relaxed">
            Our platform aggregates publicly available data from Forbes, Bloomberg, Celebrity Net Worth, and major financial news outlets to give you the clearest possible picture of who owns what — from superyachts and private jets to art collections and sprawling estates.
          </p>
        </section>

        <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)' }} />

        {/* What We Cover */}
        <section>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '22px', color: '#c9a84c', fontWeight: 400, marginBottom: '16px' }}>
            What We Cover
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: '500+', desc: 'Celebrity profiles' },
              { label: '6', desc: 'Categories tracked' },
              { label: 'Daily', desc: 'Data updates' },
              { label: 'Public', desc: 'Sources only' },
            ].map(({ label, desc }) => (
              <div key={label} className="p-4 rounded-xl" style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)' }}>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '26px', color: '#c9a84c', fontWeight: 400 }}>{label}</p>
                <p className="text-[12px] text-white/50 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)' }} />

        {/* Data Sources */}
        <section>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '22px', color: '#c9a84c', fontWeight: 400, marginBottom: '16px' }}>
            Our Data Sources
          </h2>
          <p className="text-[14px] text-white/70 leading-relaxed mb-6">
            All net worth estimates and asset valuations are sourced from credible public reporting. We do not speculate or fabricate figures. Our primary references include:
          </p>
          <ul className="space-y-3">
            {[
              'Forbes Billionaires List & Celebrity Net Worth Index',
              'Bloomberg Billionaires Index',
              'Celebrity Net Worth (public editorial estimates)',
              'Reuters, Financial Times, and Wall Street Journal',
              'Public property records and real estate filings',
              'SEC filings and company disclosures',
              'Verified court documents and public financial statements',
            ].map(source => (
              <li key={source} className="flex items-start gap-3 text-[13px] text-white/65">
                <span style={{ color: '#c9a84c', marginTop: '2px', flexShrink: 0 }}>◆</span>
                {source}
              </li>
            ))}
          </ul>
        </section>

        <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)' }} />

        {/* Disclaimer */}
        <section>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '22px', color: '#c9a84c', fontWeight: 400, marginBottom: '16px' }}>
            Important Disclaimer
          </h2>
          <p className="text-[14px] text-white/70 leading-relaxed mb-4">
            Net worth figures are estimates based on publicly available information and should not be treated as financial fact. Market conditions, private holdings, and debt obligations can significantly affect actual wealth.
          </p>
          <p className="text-[14px] text-white/70 leading-relaxed mb-4">
            Gossip and controversy sections are based on publicly reported news and media coverage. We do not verify the accuracy of allegations or claims reported by third-party media. Coverage does not imply endorsement or confirmation.
          </p>
          <p className="text-[14px] text-white/70 leading-relaxed">
            Images displayed on this platform are sourced from Wikipedia Commons, Unsplash, or other fair-use providers. Wealth Explorer is for informational and entertainment purposes only — not financial advice.
          </p>
        </section>

        <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)' }} />

        {/* Contact */}
        <section>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '22px', color: '#c9a84c', fontWeight: 400, marginBottom: '16px' }}>
            Contact
          </h2>
          <p className="text-[14px] text-white/70 leading-relaxed">
            For data corrections, removal requests, or general enquiries, please reach out via our contact page. We take accuracy seriously and will review all substantiated requests promptly.
          </p>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-5" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <nav className="flex items-center justify-center flex-wrap gap-x-5 gap-y-2 mb-5">
            {[
              { label: 'Home', to: '/' },
              { label: 'Terms of Use', to: '/terms' },
              { label: 'Privacy Policy', to: '/terms' },
            ].map((link, i, arr) => (
              <span key={link.label} className="flex items-center gap-5">
                <Link to={link.to} className="text-[11px] text-white/50 hover:text-[#c9a84c] transition-colors tracking-wide">
                  {link.label}
                </Link>
                {i < arr.length - 1 && <span className="text-white/20 text-[11px]">|</span>}
              </span>
            ))}
          </nav>
          <p className="text-[10px] text-white/25 tracking-wide">© 2026 Wealth Explorer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
