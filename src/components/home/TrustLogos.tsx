'use client'

const COMPANIES = [
  'TCS', 'Infosys', 'Wipro', 'HCL', 'Accenture',
  'Google', 'Amazon', 'Microsoft', 'Flipkart', 'Swiggy',
  'Zomato', 'Razorpay', 'PhonePe', 'CRED', 'Meesho',
  'Ola', 'Paytm', 'Byju\'s', 'Dream11', 'Freshworks',
]

export function TrustLogos() {
  const doubled = [...COMPANIES, ...COMPANIES]

  return (
    <section style={{ padding: '48px 0', borderTop: '1px solid #1E3A5F', borderBottom: '1px solid #1E3A5F', background: '#0A1628', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#4A6FA5', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Jobs from top companies — all in one place
        </p>
      </div>

      {/* Marquee track */}
      <div style={{ position: 'relative' }}>
        {/* fade edges */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(90deg,#0A1628,transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(-90deg,#0A1628,transparent)', zIndex: 2, pointerEvents: 'none' }} />

        <div style={{ display: 'flex', animation: 'marquee 32s linear infinite', width: 'max-content' }}>
          {doubled.map((name, i) => (
            <div key={i} style={{
              flexShrink: 0,
              margin: '0 24px',
              padding: '10px 24px',
              borderRadius: 12,
              background: '#0F2044',
              border: '1px solid #1E3A5F',
              fontSize: 14,
              fontWeight: 700,
              color: '#8B9DC3',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}>
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
