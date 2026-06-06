import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCryptoStore from '../store/useCryptoStore';
import PortfolioItem from '../components/portfolio/PortfolioItem';
import PortfolioModal from '../components/portfolio/PortfolioModal';
import { formatMarketCap, formatPrice } from '../utils/formatters';

export default function Portfolio() {
  const { portfolio, coins, prices } = useCryptoStore();
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  const getPrice = (id) => {
    const coin = coins.find((c) => c.id === id);
    const liveKey = (coin?.symbol?.toUpperCase() || '') + 'USDT';
    return prices[liveKey] ? parseFloat(prices[liveKey]) : (coin?.current_price || 0);
  };

  const totalValue = portfolio.reduce((s, item) => s + getPrice(item.id) * item.quantity, 0);
  const totalCost = portfolio.reduce((s, item) => s + item.purchasePrice * item.quantity, 0);
  const totalPL = totalValue - totalCost;
  const totalPLPct = totalCost > 0 ? ((totalPL / totalCost) * 100).toFixed(2) : 0;
  const isUp = totalPL >= 0;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>
            My <span style={{ color: 'var(--accent-purple)' }}>Portfolio</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            {portfolio.length} asset{portfolio.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" onClick={() => navigate('/')}>← Market</button>
          <button className="btn-primary" onClick={() => setShowAdd(true)}>＋ Add Asset</button>
        </div>
      </div>

      {/* Summary Cards */}
      {portfolio.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          <div className="card" style={{ padding: '20px 24px' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Total Value</p>
            <p data-testid="portfolio-total-value" style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Space Mono, monospace' }}>
              {formatMarketCap(totalValue)}
            </p>
          </div>
          <div className="card" style={{ padding: '20px 24px' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Total Cost</p>
            <p style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Space Mono, monospace' }}>
              {formatMarketCap(totalCost)}
            </p>
          </div>
          <div className="card" style={{ padding: '20px 24px', borderColor: isUp ? 'rgba(0,255,135,0.2)' : 'rgba(255,61,107,0.2)' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>
              Profit / Loss
            </p>
            <p
              data-testid="portfolio-pl"
              style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Space Mono, monospace', color: isUp ? 'var(--accent-green)' : 'var(--accent-red)' }}
            >
              {isUp ? '+' : ''}{formatMarketCap(totalPL)}
            </p>
            <p style={{ fontSize: 13, marginTop: 4, color: isUp ? 'var(--accent-green)' : 'var(--accent-red)', fontFamily: 'Space Mono, monospace' }}>
              {isUp ? '▲' : '▼'} {Math.abs(totalPLPct)}%
            </p>
          </div>
        </div>
      )}

      {/* Portfolio Items */}
      {portfolio.length === 0 ? (
        <div className="card" style={{ padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No assets yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
            Start tracking your crypto holdings by adding your first asset.
          </p>
          <button className="btn-primary" onClick={() => setShowAdd(true)}>Add Your First Asset</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {portfolio.map((item) => {
            const coin = coins.find((c) => c.id === item.id);
            return <PortfolioItem key={item.id} item={item} coin={coin} />;
          })}
        </div>
      )}

      <PortfolioModal isOpen={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}