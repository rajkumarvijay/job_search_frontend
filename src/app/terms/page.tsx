import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions — JobQuest India',
  description: 'Read the Terms and Conditions governing your use of the JobQuest India platform.',
}

const LAST_UPDATED = 'June 10, 2026'

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: [
      {
        sub: '',
        body: 'By accessing or using the JobQuest India platform (the "Platform"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please discontinue use of the Platform immediately. These Terms apply to all visitors, registered users, job seekers, and employers who access or use our services.',
      },
    ],
  },
  {
    title: '2. Description of Services',
    content: [
      {
        sub: '2.1 Job Aggregation',
        body: 'JobQuest aggregates job listings from third-party portals including LinkedIn, Indeed, Naukri, Glassdoor, ZipRecruiter, and Google Jobs. We do not create, own, or guarantee the accuracy of these listings. All listings are sourced from third-party APIs and public feeds.',
      },
      {
        sub: '2.2 Resume Analysis',
        body: 'Our AI-powered resume scoring tool provides an ATS compatibility score and improvement suggestions based on your uploaded resume. This is an automated tool and does not constitute professional career advice. Scores and recommendations are indicative only.',
      },
      {
        sub: '2.3 Job Posting',
        body: 'We allow employers and individuals to post free job listings on the Platform. Posted listings are publicly visible and searchable. JobQuest reserves the right to remove any listing that violates these Terms.',
      },
      {
        sub: '2.4 User Dashboard',
        body: 'Registered users have access to a personal dashboard including application tracking, saved jobs, interview scheduling, and search analytics. Dashboard features that rely on local storage are stored in your browser and are not backed up by JobQuest.',
      },
    ],
  },
  {
    title: '3. User Accounts',
    content: [
      {
        sub: '3.1 Registration',
        body: 'Account creation is handled by Clerk, our third-party authentication provider. By creating an account, you also agree to Clerk\'s Terms of Service and Privacy Policy. You are responsible for maintaining the security of your account credentials.',
      },
      {
        sub: '3.2 Account Responsibility',
        body: 'You are solely responsible for all activity that occurs under your account. You agree to notify us immediately at support@jobquest.in if you suspect any unauthorised use of your account.',
      },
      {
        sub: '3.3 Account Termination',
        body: 'We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or cause harm to other users or the Platform, without prior notice.',
      },
    ],
  },
  {
    title: '4. Acceptable Use',
    content: [
      {
        sub: '4.1 Permitted Use',
        body: 'You may use the Platform for lawful personal or professional purposes, including searching for jobs, posting legitimate job vacancies, analysing your resume, and managing your job applications.',
      },
      {
        sub: '4.2 Prohibited Conduct',
        body: 'You agree not to: (a) post false, misleading, or fraudulent job listings; (b) scrape, crawl, or automatically collect data from the Platform without our written consent; (c) interfere with or disrupt the Platform\'s servers or networks; (d) upload malicious files, viruses, or harmful code; (e) impersonate any person or entity; (f) violate any applicable local, national, or international law.',
      },
      {
        sub: '4.3 Job Posting Standards',
        body: 'All job postings must represent genuine, real employment opportunities. Listings must not contain discriminatory language, misleading salary information, or requests for payment from applicants. JobQuest may remove any listing without notice that does not meet these standards.',
      },
    ],
  },
  {
    title: '5. Intellectual Property',
    content: [
      {
        sub: '5.1 Our Content',
        body: 'The JobQuest brand, logo, website design, software, and original content are the intellectual property of JobQuest India and are protected by applicable copyright and trademark laws. You may not reproduce, distribute, or create derivative works without our express written permission.',
      },
      {
        sub: '5.2 Third-Party Content',
        body: 'Job listings aggregated from third-party portals remain the intellectual property of their respective owners. JobQuest does not claim ownership over any third-party job listing content.',
      },
      {
        sub: '5.3 User Content',
        body: 'By submitting content to JobQuest (including job postings, messages, or profile data), you grant us a non-exclusive, royalty-free licence to use, display, and distribute such content solely for the purpose of operating the Platform.',
      },
    ],
  },
  {
    title: '6. Third-Party Links & Services',
    content: [
      {
        sub: '',
        body: 'The Platform contains links to third-party websites including job portals, company websites, and our authentication provider (Clerk). These links are provided for your convenience. JobQuest is not responsible for the content, privacy practices, or terms of any third-party website. Accessing third-party sites is at your own risk.',
      },
    ],
  },
  {
    title: '7. Disclaimers',
    content: [
      {
        sub: '7.1 No Employment Guarantee',
        body: 'JobQuest is a job search and aggregation platform. We do not guarantee employment, interview invitations, or any specific outcome from using the Platform. The quality, accuracy, and availability of job listings depends on third-party portals which we do not control.',
      },
      {
        sub: '7.2 Platform Availability',
        body: 'We aim to maintain Platform availability but do not guarantee uninterrupted access. The Platform may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control.',
      },
      {
        sub: '7.3 Resume Analysis Accuracy',
        body: 'ATS scores and resume recommendations are generated by AI and are provided "as is" for informational purposes only. Results may vary depending on the target role, industry, and individual ATS systems used by employers.',
      },
      {
        sub: '7.4 "As Is" Service',
        body: 'The Platform is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.',
      },
    ],
  },
  {
    title: '8. Limitation of Liability',
    content: [
      {
        sub: '',
        body: 'To the maximum extent permitted by applicable law, JobQuest India shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, or goodwill — arising from your use of or inability to use the Platform, even if we have been advised of the possibility of such damages. Our total liability for any claim related to these Terms shall not exceed INR 1,000.',
      },
    ],
  },
  {
    title: '9. Indemnification',
    content: [
      {
        sub: '',
        body: 'You agree to indemnify, defend, and hold harmless JobQuest India, its directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including legal fees) arising out of or in any way connected with your access to or use of the Platform, your violation of these Terms, or your infringement of any third-party rights.',
      },
    ],
  },
  {
    title: '10. Privacy',
    content: [
      {
        sub: '',
        body: 'Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.',
      },
    ],
  },
  {
    title: '11. Changes to Terms',
    content: [
      {
        sub: '',
        body: 'We reserve the right to modify these Terms at any time. The "Last Updated" date at the top of this page will be revised accordingly. Your continued use of the Platform after changes are posted constitutes your acceptance of the revised Terms. We encourage you to review these Terms periodically.',
      },
    ],
  },
  {
    title: '12. Governing Law',
    content: [
      {
        sub: '',
        body: 'These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Bangalore, Karnataka, India.',
      },
    ],
  },
  {
    title: '13. Contact',
    content: [
      {
        sub: '',
        body: 'If you have any questions about these Terms, please contact us at support@jobquest.in or through our Contact Us page. We will respond within 48 hours.',
      },
    ],
  },
]

export default function TermsPage() {
  return (
    <div style={{ background: '#0A1628', minHeight: '100vh', padding: '56px 24px 100px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Back */}
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 36,
          padding: '8px 16px', borderRadius: 10, textDecoration: 'none',
          border: '1px solid #1E3A5F', color: '#8B9DC3', fontSize: 14, fontWeight: 500,
        }}>
          <ArrowLeft size={15} /> Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999, marginBottom: 20,
            background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.22)',
            color: '#A78BFA', fontSize: 13, fontWeight: 600,
          }}>
            <FileText size={13} /> Legal
          </div>
          <h1 style={{
            fontSize: 'clamp(28px,5vw,44px)', fontWeight: 900,
            color: '#F0F4FF', letterSpacing: '-0.03em', marginBottom: 14, lineHeight: 1.1,
          }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ fontSize: 14, color: '#4A6FA5' }}>
            Last updated: <strong style={{ color: '#8B9DC3' }}>{LAST_UPDATED}</strong>
            &nbsp;&middot;&nbsp;
            Applies to: <strong style={{ color: '#8B9DC3' }}>jobquest.in</strong>
          </p>
          <p style={{ fontSize: 15, color: '#8B9DC3', lineHeight: 1.75, marginTop: 16 }}>
            Please read these Terms and Conditions carefully before using the JobQuest India
            platform. By accessing or using our service, you confirm that you have read,
            understood, and agree to be bound by these Terms.
          </p>
        </div>

        {/* Table of contents */}
        <div style={{
          background: '#0F2044', border: '1px solid #1E3A5F',
          borderRadius: 16, padding: '24px 28px', marginBottom: 48,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#4A6FA5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Contents</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '8px 24px' }}>
            {sections.map(({ title }) => (
              <a key={title} href={`#${title.replace(/\s+/g, '-').toLowerCase()}`}
                style={{ fontSize: 14, color: '#8B9DC3', textDecoration: 'none' }}>
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
            <Link href="/privacy" style={{ fontSize: 13, color: '#8B9DC3', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/contact" style={{ fontSize: 13, color: '#8B9DC3', textDecoration: 'none' }}>Contact Us</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
