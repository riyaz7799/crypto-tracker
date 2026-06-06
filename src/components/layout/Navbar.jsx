import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import useCryptoStore from '../../store/useCryptoStore';

export default function Navbar() {
  const location = useLocation();
  const wsStatus = useCryptoStore((s) => s.wsStatus);
  const coins = useCryptoStore((s) => s.coins);
  const prices = useCryptoStore((s) => s.prices);
  const [mobileOpen, setMobileOpen] = useState(false);

  const btc = coins.find((c) => c.symbol === 'btc');
  const eth = coins.find((c) => c.symbol === 'eth');
  const btcPrice = prices['BTCUSDT'] ? parseFloat(prices['BTCUSDT']) : btc?.current_price;
  const ethPrice = prices['ETHUSDT'] ? parseFloat(prices['ETHUSDT']) : eth?.current_price;

  const fmt = (p) => p ? '$' + parseFloat(p).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '—';

  const wsColor = wsStatus === 'OPEN' ? 'var(--accent-green)' : wsStatus === 'CONNECTING' ? 'var(--accent-yellow)' : 'var(--accent-red)';

  return (
    <nav className="glass" style={{
      position: 'sticky', top: 0, zIndex: 200,
      borderBottom: '1px solid var(--border)',
      borderTop: 'none', borderLeft: 'none', borderRight: 'none',
    }}>
      {/* Ticker bar */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '5px 24px',
        display: 'flex', alignItems: 'center', gap: 28,
        fontSize: 11, color: 'var(--text-muted)',
        overflowX: 'auto',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <span style={{ color: 'var(--accent-yellow)', fontWeight: 700 }}>BTC</span>
          <span className="num" style={{ color: 'var(--text-secondary)' }}>{fmt(btcPrice)}</span>
          {btc?.price_change_percentage_24h !== undefined && (
            <span className="num" style={{ color: btc.price_change_percentage_24h >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {btc.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(btc.price_change_percentage_24h).toFixed(2)}%
            </span>
          )}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <span style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>ETH</span>
          <span className="num" style={{ color: 'var(--text-secondary)' }}>{fmt(ethPrice)}</span>
          {eth?.price_change_percentage_24h !== undefined && (
            <span className="num" style={{ color: eth.price_change_percentage_24h >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {eth.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(eth.price_change_percentage_24h).toFixed(2)}%
            </span>
          )}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 'auto', whiteSpace: 'nowrap' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: wsColor, display: 'inline-block', boxShadow: wsStatus === 'OPEN' ? 'var(--glow-green)' : 'none' }} />
          <span className="num">WS {wsStatus}</span>
        </span>
      </div>

      {/* Main nav */}
      <div style={{
        maxWidth: 1440, margin: '0 auto',
        padding: '0 24px', height: 58,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, boxShadow: '0 2px 12px rgba(61,139,255,0.35)',
          }}>₿</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              Crypto<span style={{ color: 'var(--accent-blue)' }}>Track</span>
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Space Mono, monospace' }}>
              Live Markets
            </div>
          </div>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 2 }}>
          {[{ to: '/', label: '📊 Market' }, { to: '/portfolio', label: '💼 Portfolio' }].map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} style={{
                textDecoration: 'none', padding: '7px 16px', borderRadius: 8,
                fontSize: 14, fontWeight: active ? 700 : 500,
                color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                background: active ? 'var(--bg-elevated)' : 'transparent',
                border: `1px solid ${active ? 'var(--border-bright)' : 'transparent'}`,
                transition: 'all 0.2s',
              }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--text-secondary)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--text-muted)'; }}
              >{label}</Link>
            );
          })}
        </div>

        <ThemeSwitcher />
      </div>
    </nav>
  );
}