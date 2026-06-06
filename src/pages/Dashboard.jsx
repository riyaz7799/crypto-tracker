import { useEffect, useState } from 'react';
import useCryptoStore from '../store/useCryptoStore';
import useWebSocket from '../hooks/useWebSocket';
import { fetchTopCoins } from '../services/coinGeckoService';
import CryptoTable from '../components/crypto/CryptoTable';
import PortfolioModal from '../components/portfolio/PortfolioModal';
import AlertManager from '../components/alerts/AlertManager';
import { formatPrice, formatMarketCap } from '../utils/formatters';

function StatCard({ label, value, sub, subUp, icon, accent, delay, extra }) {
  return (
    <div className={`card card-hover fade-up delay-${delay}`} style={{ padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
      {/* Accent glow top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${accent}, transparent)`, borderRadius: '16px 16px 0 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p className="stat-label" style={{ marginBottom: 10 }}>{label}</p>
          <p className="num" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</p>
          {sub && (
            <p className="num" style={{ fontSize: 12, marginTop: 7, color: subUp ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {subUp ? '▲' : '▼'} {sub}
            </p>
          )}
          {extra && <p style={{ fontSize: 12, marginTop: 6, color: 'var(--text-muted)' }}>{extra}</p>}
        </div>
        <div style={{
          width: 42, height: 42, borderRadius: 11,
          background: `${accent}18`, border: `1px solid ${accent}28`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 19, flexShrink: 0,
        }}>{icon}</div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card" style={{ padding: '20px 22px', height: 100 }}>
            <div className="skeleton" style={{ height: 10, width: '40%', marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 22, width: '65%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 10, width: '30%' }} />
          </div>
        ))}
      </div>
      <div className="card" style={{ overflow: 'hidden' }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'center' }}>
            <div className="skeleton" style={{ width: 30, height: 30, borderRadius: '50%' }} />
            <div className="skeleton" style={{ width: 120, height: 14 }} />
            <div className="skeleton" style={{ width: 80, height: 14, marginLeft: 'auto' }} />
            <div className="skeleton" style={{ width: 60, height: 22, borderRadius: 5 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { setCoins, coins, prices } = useCryptoStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  const symbols = coins.slice(0, 30).map((c) => c.symbol.toUpperCase() + 'USDT');
  useWebSocket(symbols);

  useEffect(() => {
    fetchTopCoins()
      .then((data) => { setCoins(data); setLoading(false); })
      .catch(() => { setError('Failed to load market data.'); setLoading(false); });
  }, []);

  const totalMarketCap = coins.reduce((s, c) => s + (c.market_cap || 0), 0);
  const gainers = coins.filter((c) => c.price_change_percentage_24h > 0).length;
  const losers = coins.length - gainers;
  const btc = coins.find((c) => c.symbol === 'btc');
  const eth = coins.find((c) => c.symbol === 'eth');
  const btcPrice = prices['BTCUSDT'] ? parseFloat(prices['BTCUSDT']) : btc?.current_price;
  const ethPrice = prices['ETHUSDT'] ? parseFloat(prices['ETHUSDT']) : eth?.current_price;
  const btcChange = btc?.price_change_percentage_24h || 0;
  const ethChange = eth?.price_change_percentage_24h || 0;
  const btcDom = btc?.market_cap && totalMarketCap ? ((btc.market_cap / totalMarketCap) * 100).toFixed(1) : null;

  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 48 }}>⚠️</div>
      <h3 style={{ fontWeight: 700, color: 'var(--accent-red)' }}>{error}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Check your connection and try again.</p>
      <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Page Header */}
      <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div className="dot-live" />
            <span className="num" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Live Market Data
            </span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.8px', lineHeight: 1 }}>
            Crypto <span style={{ color: 'var(--accent-blue)' }}>Markets</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>
            Tracking {coins.length} assets • Real-time WebSocket stream
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => setShowAlerts(true)}>
            🔔 <span>Price Alerts</span>
          </button>
          <button className="btn btn-primary" onClick={() => setShowPortfolio(true)}>
            ＋ Add to Portfolio
          </button>
        </div>
      </div>

      {loading ? <LoadingSkeleton /> : (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))', gap: 14 }}>
            <StatCard delay={1} label="Total Market Cap" value={formatMarketCap(totalMarketCap)} extra={`${coins.length} assets tracked`} icon="🌐" accent="var(--accent-blue)" />
            <StatCard delay={2} label="Bitcoin" value={formatPrice(btcPrice)} sub={`${Math.abs(btcChange).toFixed(2)}% 24h`} subUp={btcChange >= 0} extra={btcDom ? `${btcDom}% dominance` : null} icon="₿" accent="var(--accent-yellow)" />
            <StatCard delay={3} label="Ethereum" value={formatPrice(ethPrice)} sub={`${Math.abs(ethChange).toFixed(2)}% 24h`} subUp={ethChange >= 0} icon="Ξ" accent="var(--accent-purple)" />
            <StatCard delay={4} label="Market Sentiment" value={`${gainers} / ${coins.length}`} extra={`${losers} declining`} icon={gainers > losers ? '🟢' : '🔴'} accent={gainers > losers ? 'var(--accent-green)' : 'var(--accent-red)'} />
          </div>

          {/* Table */}
          <CryptoTable />
        </>
      )}

      <PortfolioModal isOpen={showPortfolio} onClose={() => setShowPortfolio(false)} />
      <AlertManager isOpen={showAlerts} onClose={() => setShowAlerts(false)} />
    </div>
  );
}