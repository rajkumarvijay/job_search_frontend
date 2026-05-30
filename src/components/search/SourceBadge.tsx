const PORTAL_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  linkedin:    { bg: 'rgba(10,102,194,0.15)',  color: '#4A9FFF',  label: 'LinkedIn' },
  indeed:      { bg: 'rgba(0,58,155,0.15)',    color: '#7BA4FF',  label: 'Indeed' },
  glassdoor:   { bg: 'rgba(12,170,65,0.15)',   color: '#4ADA7E',  label: 'Glassdoor' },
  naukri:      { bg: 'rgba(255,102,0,0.15)',   color: '#FF8C42',  label: 'Naukri' },
  ziprecruiter:{ bg: 'rgba(123,45,139,0.15)',  color: '#C07FD8',  label: 'ZipRecruiter' },
  google:      { bg: 'rgba(234,67,53,0.15)',   color: '#FF7B73',  label: 'Google Jobs' },
}

export function SourceBadge({ platform }: { platform: string }) {
  const key = platform.toLowerCase().replace(/\s+/g, '').replace('jobs', '')
  const match = Object.entries(PORTAL_STYLES).find(([k]) => key.includes(k) || platform.toLowerCase().includes(k))
  const style = match ? match[1] : { bg: 'rgba(139,157,195,0.12)', color: '#8B9DC3', label: platform }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 9px',
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 700,
      background: style.bg,
      color: style.color,
      letterSpacing: '0.02em',
    }}>
      {style.label}
    </span>
  )
}
