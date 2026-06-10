import Link from 'next/link'
import { Shield, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — JobQuest India',
  description: 'Learn how JobQuest India collects, uses, and protects your personal information.',
}

const LAST_UPDATED = 'June 10, 2026'

const sections = [
  {
    title: '1. Information We Collect',
    content: [
      {
        sub: '1.1 Information You Provide',
        body: 'When you use JobQuest, you may voluntarily provide us with personal information including your name, email address, phone number, resume or CV, job preferences, and any other information you choose to submit through our forms, profile, or contact pages.',
      },
      {
        sub: '1.2 Information Collected Automatically',
        body: 'We automatically collect certain information when you visit our platform, including your IP address, browser type and version, operating system, pages visited, time spent on pages, referring URLs, and device identifiers. This data is collected through cookies, web beacons, and similar tracking technologies.',
      },
      {
        sub: '1.3 Session & Search Data',
        body: 'We store a session identifier in your browser\'s local storage to associate your saved jobs and search history across visits. Search queries, filters applied, and job clicks are logged to improve recommendations and platform performance.',
      },
      {
        sub: '1.4 Authentication Data',
        body: 'If you sign in via Clerk (our authentication provider), we receive your name, email address, and profile picture as provided to Clerk by your chosen sign-in method. We do not receive or store your passwords.',
      },
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      {
        sub: '2.1 Platform Functionality',
        body: 'We use your information to provide, maintain, and improve the JobQuest platform — including returning your saved jobs, showing relevant job recommendations, generating ATS resume scores, and tracking your application history.',
      },
      {
        sub: '2.2 Personalisation',
        body: 'Search history, saved jobs, and profile data are used to personalise job recommendations and dashboard analytics. This processing is performed on our servers and is not shared with third-party advertising networks.',
      },
      {
        sub: '2.3 Communications',
        body: 'If you contact us via our contact form or email, we use the information you provide solely to respond to your enquiry. We do not add you to marketing lists without your explicit consent.',
      },
      {
        sub: '2.4 Security & Fraud Prevention',
        body: 'We may use your information to detect, investigate, and prevent fraudulent transactions, abuse, and other illegal activities, and to protect the rights and property of JobQuest and our users.',
      },
    ],
  },
  {
    title: '3. Job Listings & Third-Party Portals',
    content: [
      {
        sub: '3.1 Aggregated Content',
        body: 'JobQuest aggregates job listings from LinkedIn, Indeed, Naukri, Glassdoor, ZipRecruiter, and Google Jobs. These listings are sourced from third-party APIs and public feeds. When you click to apply, you are redirected to the original job portal, which has its own privacy policy.',
      },
      {
        sub: '3.2 No Data Sharing with Portals',
        body: 'We do not share your personal data (name, email, resume) with any third-party job portal on your behalf. Any application you submit goes directly to the portal\'s own system.',
      },
      {
        sub: '3.3 Posted Jobs',
        body: 'If you post a job listing, your contact email and company information become publicly visible as part of that listing. You may delete your listing at any time via the My Listings section.',
      },
    ],
  },
  {
    title: '4. Cookies & Tracking',
    content: [
      {
        sub: '4.1 Essential Cookies',
        body: 'We use cookies that are strictly necessary to operate the platform, including authentication session cookies managed by Clerk and local storage tokens for your session ID.',
      },
      {
        sub: '4.2 Analytics',
        body: 'We may use anonymised analytics to understand how users interact with the platform. These analytics do not identify individual users and are used solely to improve platform features and performance.',
      },
      {
        sub: '4.3 Managing Cookies',
        body: 'You can control or delete cookies through your browser settings. Disabling essential cookies may impair platform functionality such as saved jobs and sign-in.',
      },
    ],
  },
  {
    title: '5. Data Storage & Security',
    content: [
      {
        sub: '5.1 Storage',
        body: 'Your data is stored on servers hosted by Railway (cloud infrastructure). Resume files uploaded for ATS analysis are processed in memory and are not permanently stored on our servers — they are discarded after the analysis is complete.',
      },
      {
        sub: '5.2 Security Measures',
        body: 'We implement industry-standard security measures including HTTPS encryption for all data in transit, hashed session identifiers, and access controls on our databases. No method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.',
      },
      {
        sub: '5.3 Data Retention',
        body: 'Search history and saved jobs are retained as long as your session remains active or until you clear them from the platform. If you request account deletion via Clerk, your authentication data is removed in accordance with Clerk\'s data retention policy.',
      },
    ],
  },
  {
    title: '6. Your Rights',
    content: [
      {
        sub: '6.1 Access & Portability',
        body: 'You have the right to request a copy of the personal data we hold about you. Contact us at support@jobquest.in to make a data access request.',
      },
      {
        sub: '6.2 Correction & Deletion',
        body: 'You may update your profile information at any time through your Clerk account settings. You may delete your search history and saved jobs directly from the platform. To request full deletion of your account data, contact support@jobquest.in.',
      },
      {
        sub: '6.3 Opt-Out',
        body: 'You may opt out of personalisation at any time by clearing your session data from the platform. This will reset your recommendations and remove your search history.',
      },
    ],
  },
  {
    title: '7. Children\'s Privacy',
    content: [
      {
        sub: '',
        body: 'JobQuest is not intended for use by individuals under the age of 16. We do not knowingly collect personal information from children under 16. If you believe we have inadvertently collected such information, please contact us immediately at support@jobquest.in.',
      },
    ],
  },
  {
    title: '8. Changes to This Policy',
    content: [
      {
        sub: '',
        body: 'We may update this Privacy Policy from time to time. The "Last Updated" date at the top of this page will reflect any changes. Continued use of JobQuest after changes are posted constitutes your acceptance of the updated policy. For material changes, we will make reasonable efforts to notify users via a banner on the platform.',
      },
    ],
  },
  {
    title: '9. Contact Us',
    content: [
      {
        sub: '',
        body: 'If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at support@jobquest.in or use the contact form on our Contact Us page.',
      },
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div style={{ background: '#0A1628', minHeight: '100vh', padding: '56px 24px 100px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Back */}
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 36,
          padding: '8px 16px', borderRadius: 10, textDecoration: 'none',
          border: '1px solid #1E3A5F', color: '#8B9DC3', fontSize: 14, fontWeight: 500,
          transition: 'all 0.18s',
        }}>
          <ArrowLeft size={15} /> Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999, marginBottom: 20,
            background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.22)',
            color: '#00C9B1', fontSize: 13, fontWeight: 600,
          }}>
            <Shield size={13} /> Legal
          </div>
          <h1 style={{
            fontSize: 'clamp(28px,5vw,44px)', fontWeight: 900,
            color: '#F0F4FF', letterSpacing: '-0.03em', marginBottom: 14, lineHeight: 1.1,
          }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 14, color: '#4A6FA5' }}>
            Last updated: <strong style={{ color: '#8B9DC3' }}>{LAST_UPDATED}</strong>
            &nbsp;&middot;&nbsp;
            Applies to: <strong style={{ color: '#8B9DC3' }}>jobquest.in</strong>
          </p>
          <p style={{ fontSize: 15, color: '#8B9DC3', lineHeight: 1.75, marginTop: 16 }}>
            JobQuest India (&quot;JobQuest&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you visit or use our platform. Please read it carefully.
          </p>
        </div>

        {/* Table of contents */}
        <div style={{
          background: '#0F2044', border: '1px solid #1E3A5F',
          borderRadius: 16, padding: '24px 28px', marginBottom: 48,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#4A6FA5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Contents</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sections.map(({ title }) => (
              <a key={title} href={`#${title.replace(/\s+/g, '-').toLowerCase()}`} style={{ fontSize: 14, color: '#8B9DC3', textDecoration: 'none' }}>
                {title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {sections.map(({ title, content }) => (
            <div key={title} id={title.replace(/\s+/g, '-').toLowerCase()}>
              <h2 style={{
                fontSize: 20, fontWeight: 800, color: '#F0F4FF',
                letterSpacing: '-0.02em', marginBottom: 20, paddingBottom: 12,
                borderBottom: '1px solid #1E3A5F',
              }}>
                {title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {content.map(({ sub, body }, i) => (
                  <div key={i}>
                    {sub && (
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#A8C0E0', marginBottom: 8 }}>{sub}</div>
                    )}
                    <p style={{ fontSize: 15, color: '#8B9DC3', lineHeight: 1.8, margin: 0 }}>{body}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer nav */}
        <div style={{
          marginTop: 64, paddingTop: 32, borderTop: '1px solid #1E3A5F',
          display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 13, color: '#4A6FA5' }}>© {new Date().getFullYear()} JobQuest India</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="/terms" style={{ fontSize: 13, color: '#8B9DC3', textDecoration: 'none' }}>Terms &amp; Conditions</Link>
            <Link href="/contact" style={{ fontSize: 13, color: '#8B9DC3', textDecoration: 'none' }}>Contact Us</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
