import useCryptoStore from '../../store/useCryptoStore';

export default function SearchInput() {
  const { searchQuery, setSearchQuery } = useCryptoStore();

  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: 12, top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-muted)', fontSize: 15, pointerEvents: 'none',
      }}>⌕</span>
      <input
        data-testid="search-input"
        type="text"
        placeholder="Search coins..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '10px 16px 10px 36px',
          color: 'var(--text-primary)',
          fontFamily: 'Syne, sans-serif',
          fontSize: 14,
          width: 260,
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--accent-blue)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}