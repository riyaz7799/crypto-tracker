import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCryptoStore from '../store/useCryptoStore';
import { formatPrice, formatMarketCap } from '../utils/formatters';

const RANGES = [
  { label: '24H', days: 1 },
  { label: '7D',  days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

// Safe sparkline — pure SVG, no external lib
function MiniSparkline({ data = [], width = 140, height = 50, symbol }) {
  if (!data || data.length < 2) return <svg data-testid={`sparkline-${symbol}`} width={width} height={height} />;
  const prices = data.slice(-40);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const isUp = prices[prices.length - 1] >= prices[0];
  const color = isUp ? '#00e87a' : '#ff2d55';
  const pts = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  }).join(' ');
  const fill = `0,${height} ${pts} ${width},${height}`;
  return (
    <svg data-testid={`sparkline-${symbol}`} width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${symbol}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fill} fill={`url(#sg-${symbol})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Safe chart — pure SVG, no external lib needed
function SafeChart({ data = [], symbol }) {
  if (!data || data.length < 2) return (
    <div data-testid="price-chart" style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>No chart data available</p>
    </div>
  );

  const width = 900;
  const height = 300;
  const pad = { top: 20, right: 20, bottom: 40, left: 70 };
  const W = width - pad.left - pad.right;
  const H = height - pad.top - pad.bottom;

  const prices = data.map(([, v]) => parseFloat(v));
  const times  = data.map(([t]) => t);
  const minP   = Math.min(...prices);
  const maxP   = Math.max(...prices);
  const rangeP = maxP - minP || 1;
  const minT   = Math.min(...times);
  const maxT   = Math.max(...times);
  const rangeT = maxT - minT || 1;
  const isUp   = prices[prices.length - 1] >= prices[0];
  const color  = isUp ? '#00e87a' : '#ff2d55';

  const toX = (t) => ((t - minT) / rangeT) * W + pad.left;
  const toY = (p) => H - ((p - minP) / rangeP) * H + pad.top;

  const step = Math.max(1, Math.floor(data.length / 120));
  const sampled = data.filter((_, i) => i % step === 0);

  const linePts  = sampled.map(([t, v]) => `${toX(t)},${toY(parseFloat(v))}`).join(' ');
  const fillPts  = `${toX(sampled[0][0])},${toY(minP)} ${linePts} ${toX(sampled[sampled.length - 1][0])},${toY(minP)}`;

  // Y axis ticks
  const yTicks = 5;
  const yTickVals = Array.from({ length: yTicks }, (_, i) => minP + (rangeP / (yTicks - 1)) * i);

  // X axis ticks
  const xTicks = 5;
  const xTickVals = Array.from({ length: xTicks }, (_, i) => minT + (rangeT / (xTicks - 1)) * i);

  const fmtTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  const fmtPrice = (p) => {
    if (p >= 1000) return '$' + (p / 1000).toFixed(1) + 'k';
    if (p >= 1) return '$' + p.toFixed(2);
    return '$' + p.toFixed(4);
  };

  return (
    <div data-testid="price-chart" style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', minWidth: 360, height: 'auto', display: 'block' }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`cg-${symbol}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <clipPath id={`clip-${symbol}`}>
            <rect x={pad.left} y={pad.top} width={W} height={H} />
          </clipPath>
        </defs>

        {/* Grid lines */}
        {yTickVals.map((v, i) => (
          <line key={i}
            x1={pad.left} y1={toY(v)} x2={pad.left + W} y2={toY(v)}
            stroke="rgba(30,30,46,0.9)" strokeWidth="1"
          />
        ))}

        {/* Fill */}
        <polygon points={fillPts} fill={`url(#cg-${symbol})`} clipPath={`url(#clip-${symbol})`} />

        {/* Line */}
        <polyline
          points={linePts}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          clipPath={`url(#clip-${symbol})`}
        />

        {/* Y Axis labels */}
        {yTickVals.map((v, i) => (
          <text key={i}
            x={pad.left - 8} y={toY(v) + 4}
            textAnchor="end" fontSize="10"
            fontFamily="Space Mono, monospace"
            fill="#50506a"
          >
            {fmtPrice(v)}
          </text>
        ))}

        {/* X Axis labels */}
        {xTickVals.map((t, i) => (
          <text key={i}
            x={toX(t)} y={height - 8}
            textAnchor="middle" fontSize="10"
            fontFamily="Space Mono, monospace"
            fill="#50506a"
          >
            {fmtTime(t)}
          </text>
        ))}

        {/* Current price line */}
        {prices.length > 0 && (
          <>
            <line
              x1={pad.left} y1={toY(prices[prices.length - 1])}
              x2={pad.left + W} y2={toY(prices[prices.length - 1])}
              stroke={color} strokeWidth="1" strokeDasharray="4 4" opacity="0.5"
            />
            <text
              x={pad.left + W + 4} y={toY(prices[prices.length - 1]) + 4}
              fontSize="9" fontFamily="Space Mono, monospace" fill={color}
            >
              {fmtPrice(prices[prices.length - 1])}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

export default function DetailView() {
  const { id }         = useParams();
  const navigate       = useNavigate();
  const coins          = useCryptoStore((s) => s.coins);
  const prices         = useCryptoStore((s) => s.prices);
  const portfolio      = useCryptoStore((s) => s.portfolio);
  const addToPortfolio = useCryptoStore((s) => s.addToPortfolio);

  const coin        = coins.find((c) => c.id === id) || null;
  const symbol      = coin ? coin.symbol.toUpperCase() + 'USDT' : '';
  const livePx      = symbol ? prices[symbol] : null;
  const currentPrice = livePx ? parseFloat(livePx) : (coin?.current_price ?? 0);

  const [history, setHistory] = useState([]);
  const [range,   setRange]   = useState(7);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [added,   setAdded]   = useState(false);
  const inPortfolio = portfolio.some((p) => p.id === id);

  const prevPx = useRef(null);
  const [flash, setFlash] = useState('');

  useEffect(() => {
    if (prevPx.current === null) { prevPx.current = currentPrice; return; }
    if (currentPrice !== prevPx.current) {
      setFlash(currentPrice > prevPx.current ? 'flash-green' : 'flash-red');
      prevPx.current = currentPrice;
      const t = setTimeout(() => setFlash(''), 800);
      return () => clearTimeout(t);
    }
  }, [currentPrice]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    const BASE = 'https://api.coingecko.com/api/v3';
    fetch(`${BASE}/coins/${id}/market_chart?vs_currency=usd&days=${range}`)
      .then((r) => { if (!r.ok) throw new Error('API error ' + r.status); return r.json(); })
      .then((data) => { setHistory(data?.prices ?? []); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [id, range]);

  const handleAdd = () => {
    if (inPortfolio || !currentPrice) return;
    addToPortfolio({ id, quantity: 1, purchasePrice: currentPrice });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const change = coin?.price_change_percentage_24h ?? 0;
  const isUp   = change >= 0;

  if (!coin) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading…</p>
      <button className="btn btn-ghost" onClick={() => navigate('/')}>← Back to Market</button>
    </div>
  );

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 1100, margin: '0 auto' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Back */}
      <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ width: 'fit-content', fontSize: 13 }}>
        ← Back to Market
      </button>

      {/* Hero Card */}
      <div className="card" style={{ padding: '26px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -80, right: -80, width: 260, height: 260,
          borderRadius: '50%', pointerEvents: 'none',
          background: isUp ? 'rgba(0,232,122,0.05)' : 'rgba(255,45,85,0.05)',
          filter: 'blur(50px)',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          {/* Identity + Price */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <img src={coin.image} alt={coin.name} width={54} height={54}
              style={{ borderRadius: '50%', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.3px' }}>{coin.name}</h1>
                <span className="badge badge-neutral">{coin.symbol.toUpperCase()}</span>
                <span className="badge badge-neutral">#{coin.market_cap_rank}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span className={`num ${flash}`} style={{ fontSize: 30, fontWeight: 800, display: 'inline-block', borderRadius: 6, padding: '2px 4px' }}>
                  {formatPrice(currentPrice)}
                </span>
                <span className={`badge ${isUp ? 'badge-up' : 'badge-down'}`} style={{ fontSize: 13, padding: '5px 11px' }}>
                  {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                </span>
                {livePx && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span className="dot-live" />
                    <span className="num" style={{ fontSize: 10, color: 'var(--text-muted)' }}>LIVE</span>
                  </span>
                )}
              </div>

              {/* 24h range bar */}
              {coin.low_24h && coin.high_24h && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                  <span className="num" style={{ fontSize: 11, color: 'var(--accent-red)', whiteSpace: 'nowrap' }}>
                    {formatPrice(coin.low_24h)}
                  </span>
                  <div style={{ width: 130, height: 4, background: 'var(--bg-elevated)', borderRadius: 2, position: 'relative', flexShrink: 0 }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: 2,
                      background: 'linear-gradient(90deg, var(--accent-red), var(--accent-green))',
                      width: `${Math.min(100, Math.max(0, ((currentPrice - coin.low_24h) / (coin.high_24h - coin.low_24h)) * 100))}%`,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <span className="num" style={{ fontSize: 11, color: 'var(--accent-green)', whiteSpace: 'nowrap' }}>
                    {formatPrice(coin.high_24h)}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>24h</span>
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
            <MiniSparkline data={coin.sparkline_in_7d?.price} symbol={symbol} width={140} height={50} />
            <button
              className={`btn ${inPortfolio || added ? 'btn-success' : 'btn-primary'}`}
              onClick={handleAdd}
              disabled={inPortfolio}
              style={{ fontSize: 13 }}
            >
              {added ? '✓ Added!' : inPortfolio ? '✓ In Portfolio' : '＋ Add to Portfolio'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {[
          { label: 'Market Cap',        value: formatMarketCap(coin.market_cap) },
          { label: 'Volume 24h',        value: formatMarketCap(coin.total_volume) },
          { label: 'Vol / MCap',        value: coin.market_cap ? ((coin.total_volume / coin.market_cap) * 100).toFixed(2) + '%' : '—' },
          { label: 'All-Time High',     value: formatPrice(coin.ath),
            sub: coin.ath_change_percentage ? coin.ath_change_percentage.toFixed(1) + '% from ATH' : null, subUp: false },
          { label: 'All-Time Low',      value: formatPrice(coin.atl),
            sub: coin.atl_change_percentage ? '+' + Math.abs(coin.atl_change_percentage).toFixed(0) + '% from ATL' : null, subUp: true },
          { label: 'Circulating Supply',
            value: coin.circulating_supply
              ? (coin.circulating_supply >= 1e9
                  ? (coin.circulating_supply / 1e9).toFixed(2) + 'B'
                  : (coin.circulating_supply / 1e6).toFixed(2) + 'M')
                + ' ' + coin.symbol.toUpperCase()
              : '—' },
        ].map((s) => (
          <div key={s.label} className="card card-hover" style={{ padding: '14px 16px' }}>
            <p className="stat-label" style={{ marginBottom: 7 }}>{s.label}</p>
            <p className="num" style={{ fontWeight: 700, fontSize: 14 }}>{s.value ?? '—'}</p>
            {s.sub && (
              <p className="num" style={{ fontSize: 11, marginTop: 5, color: s.subUp ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                {s.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Chart Card */}
      <div className="card" style={{ padding: '22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>Price Chart</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
              {coin.name} / USD
            </p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {RANGES.map((r) => (
              <button key={r.label} onClick={() => setRange(r.days)} style={{
                padding: '5px 13px', borderRadius: 7,
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Space Mono, monospace',
                background: range === r.days ? 'var(--accent-blue)' : 'var(--bg-elevated)',
                color:      range === r.days ? '#fff'               : 'var(--text-muted)',
                border: `1px solid ${range === r.days ? 'var(--accent-blue)' : 'var(--border)'}`,
                transition: 'all 0.18s',
              }}>{r.label}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--accent-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading chart data…</span>
          </div>
        ) : error ? (
          <div style={{ height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ fontSize: 36 }}>📉</span>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{error}</p>
            <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setRange(r => r)}>Retry</button>
          </div>
        ) : (
          <SafeChart data={history} symbol={symbol} />
        )}
      </div>

      {/* Supply Info */}
      {(coin.circulating_supply || coin.total_supply || coin.max_supply) && (
        <div className="card" style={{ padding: '20px 24px' }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Supply Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Circulating Supply', value: coin.circulating_supply, max: coin.max_supply || coin.total_supply },
              { label: 'Total Supply',        value: coin.total_supply },
              { label: 'Max Supply',          value: coin.max_supply },
            ].filter((s) => s.value).map((s) => {
              const fmt = (v) => v >= 1e9 ? (v / 1e9).toFixed(2) + 'B' : (v / 1e6).toFixed(2) + 'M';
              const pct = s.max ? Math.min(100, (s.value / s.max) * 100) : null;
              return (
                <div key={s.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</span>
                    <span className="num" style={{ fontSize: 13, fontWeight: 600 }}>
                      {fmt(s.value)} {coin.symbol.toUpperCase()}
                    </span>
                  </div>
                  {pct !== null && (
                    <div style={{ height: 4, background: 'var(--bg-elevated)', borderRadius: 2 }}>
                      <div style={{
                        height: '100%', borderRadius: 2, transition: 'width 0.6s ease',
                        background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))',
                        width: `${pct}%`,
                      }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}