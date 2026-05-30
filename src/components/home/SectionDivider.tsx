export function SectionDivider() {
  return (
    <div style={{
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      margin: '8px 0',
    }}>
      {/* Left fade cap */}
      <div style={{
        flex: 1,
        maxWidth: 120,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
      }}>
        <div style={{
          height: 1.5,
          borderRadius: 999,
          background: 'linear-gradient(to right, transparent, rgba(0,201,177,0.35))',
        }} />
        <div style={{
          height: 1.5,
          borderRadius: 999,
          background: 'linear-gradient(to right, transparent, rgba(56,189,248,0.25))',
        }} />
      </div>

      {/* Center body */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
      }}>
        <div style={{
          height: 1.5,
          borderRadius: 999,
          background: 'linear-gradient(to right, rgba(0,201,177,0.35), rgba(0,201,177,0.7) 30%, rgba(56,189,248,0.8) 50%, rgba(0,201,177,0.7) 70%, rgba(0,201,177,0.35))',
          boxShadow: '0 0 8px rgba(0,201,177,0.3)',
        }} />
        <div style={{
          height: 1.5,
          borderRadius: 999,
          background: 'linear-gradient(to right, rgba(56,189,248,0.25), rgba(56,189,248,0.55) 30%, rgba(0,201,177,0.65) 50%, rgba(56,189,248,0.55) 70%, rgba(56,189,248,0.25))',
          boxShadow: '0 0 6px rgba(56,189,248,0.2)',
        }} />
      </div>

      {/* Right fade cap */}
      <div style={{
        flex: 1,
        maxWidth: 120,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
      }}>
        <div style={{
          height: 1.5,
          borderRadius: 999,
          background: 'linear-gradient(to left, transparent, rgba(0,201,177,0.35))',
        }} />
        <div style={{
          height: 1.5,
          borderRadius: 999,
          background: 'linear-gradient(to left, transparent, rgba(56,189,248,0.25))',
        }} />
      </div>
    </div>
  )
}
