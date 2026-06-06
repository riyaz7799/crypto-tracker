import useCryptoStore from '../../store/useCryptoStore';

export default function ThemeSwitcher() {
  const { isDark, toggleTheme } = useCryptoStore();

  return (
    <button
      data-testid="theme-switcher"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 38, height: 38, borderRadius: 9,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        cursor: 'pointer', fontSize: 15,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s', color: 'var(--text-secondary)',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}