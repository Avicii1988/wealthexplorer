import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function TermsPage() {
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
        <p className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: '#c9a84c' }}>Legal</p>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 6vw, 48px)', fontWeight: 400, color: '#fff', letterSpacing: '0.02em', lineHeight: 1.15 }}>
          Terms &amp; Conditions
        </h1>
        <p className="text-[12px] text-white/35 mt-4 tracking-wide">Last updated: 22 March 2026</p>
        <div className="w-10 h-px mx-auto mt-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)' }} />
      </section>

      {/* ── CONTENT ── */}
      <main className="max-w-2xl mx-auto px-5 pb-20 space-y-12">

        {[
          {
            title: '1. Acceptance of Terms',
            body: 'By accessing or using Wealth Explorer ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the Platform. We reserve the right to modify these terms at any time. Continued use of the Platform after changes constitutes acceptance of the updated terms.',
          },
          {
            title: '2. Informational Purpose Only',
            body: 'All content on Wealth Explorer — including net worth estimates, asset valuations, biographical information, and gossip coverage — is provided for informational and entertainment purposes only. Nothing on this Platform constitutes financial, legal, investment, or professional advice of any kind. You should consult a qualified professional before making any financial decisions.',
          },
          {
            title: '3. Accuracy of Data',
            body: 'Net worth figures and asset valuations are estimates derived from publicly available sources including Forbes, Bloomberg, Celebrity Net Worth, and major financial news outlets. These figures are approximate and subject to change. Wealth Explorer makes no guarantees regarding the accuracy, completeness, or timeliness of any data presented on the Platform. We are not responsible for decisions made based on information found here.',
          },
          {
            title: '4. Gossip & Controversy Content',
            body: 'Gossip and controversy sections are based entirely on publicly reported news stories, court documents, and media coverage. Inclusion of such content does not imply that Wealth Explorer endorses, verifies, or confirms the accuracy of any allegations or claims. The Platform reports what has been publicly stated; it does not independently investigate or verify such claims.',
          },
          {
            title: '5. Intellectual Property',
            body: 'The Wealth Explorer name, logo, design, and original written content are the intellectual property of Wealth Explorer and may not be reproduced, distributed, or used without express written permission. Celebrity images are sourced from Wikimedia Commons (CC-licensed), Unsplash, or other fair-use providers and remain the property of their respective rights holders.',
          },
          {
            title: '6. Privacy Policy',
            body: 'Wealth Explorer does not collect personal data beyond standard analytics (page views, session duration, device type). We do not sell, share, or monetise user data. Cookies may be used to remember user preferences (such as language selection and followed celebrities). By using the Platform, you consent to this limited data use.',
          },
          {
            title: '7. Third-Party Links',
            body: 'The Platform may contain links to third-party websites for reference purposes. Wealth Explorer has no control over the content, privacy practices, or accuracy of those sites and accepts no responsibility for them. Linking does not constitute endorsement.',
          },
          {
            title: '8. Limitation of Liability',
            body: 'To the fullest extent permitted by applicable law, Wealth Explorer shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of — or inability to use — the Platform or its content. This includes, without limitation, damages for loss of profits, goodwill, data, or other intangible losses.',
          },
          {
            title: '9. Content Removal Requests',
            body: 'If you believe information about you or a third party is factually incorrect, defamatory, or should be removed for legal reasons, please contact us with specific details. We will review all substantiated requests in good faith and respond within 30 days. We are committed to accuracy and will correct verifiable errors promptly.',
          },
          {
            title: '10. Governing Law',
            body: 'These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising in connection with these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the relevant courts.',
          },
        ].map(({ title, body }) => (
          <section key={title}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '18px', color: '#c9a84c', fontWeight: 400, marginBottom: '12px' }}>
              {title}
            </h2>
            <p className="text-[14px] text-white/65 leading-relaxed">{body}</p>
          </section>
        ))}

        <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)' }} />

        <section className="text-center">
          <p className="text-[13px] text-white/40 leading-relaxed">
            Questions about these Terms? Visit our{' '}
            <Link to="/about" className="hover:text-[#c9a84c] transition-colors underline underline-offset-2">
              About page
            </Link>{' '}
            for contact information.
          </p>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-5" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <nav className="flex items-center justify-center flex-wrap gap-x-5 gap-y-2 mb-5">
            {[
              { label: 'Home', to: '/' },
              { label: 'About Us', to: '/about' },
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
