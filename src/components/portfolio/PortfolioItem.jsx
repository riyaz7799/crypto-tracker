import useCryptoStore from '../../store/useCryptoStore';
import { formatPrice, formatMarketCap } from '../../utils/formatters';

export default function PortfolioItem({ item, coin }) {
  const livePrice = useCryptoStore((s) => s.prices[(coin?.symbol?.toUpperCase() || '') + 'USDT']);
  const removeFromPortfolio = useCryptoStore((s) => s.removeFromPortfolio);

  const currentPrice = livePrice ? parseFloat(livePrice) : (coin?.current_price || 0);
  const totalValue = currentPrice * item.quantity;
  const costBasis = item.purchasePrice * item.quantity;
  const pl = totalValue - costBasis;
  const plPct = costBasis > 0 ? ((pl / costBasis) * 100).toFixed(2) : 0;
  const isUp = pl >= 0;

  return (
    <div
      data-testid={`portfolio-item-${item.id}`}
      className="card"
      style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {coin?.image && <img src={coin.image} alt={coin.name} style={{ width: 36, height: 36, borderRadius: '50%' }} />}
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{coin?.name || item.id}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Space Mono,monospace' }}>
            {item.quantity} @ {formatPrice(item.purchasePrice)}
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'Space Mono,monospace' }}>
          {formatMarketCap(totalValue)}
        </div>
        <div style={{ fontSize: 12, color: isUp ? 'var(--accent-green)' : 'var(--accent-red)', fontFamily: 'Space Mono,monospace' }}>
          {isUp ? '+' : ''}{formatMarketCap(pl)} ({plPct}%)
        </div>
      </div>
      <button
        onClick={() => removeFromPortfolio(item.id)}
        style={{
          background: 'rgba(255,61,107,0.1)', border: '1px solid rgba(255,61,107,0.2)',
          borderRadius: 6, padding: '6px 10px', color: 'var(--accent-red)',
          cursor: 'pointer', fontSize: 13, fontWeight: 600,
        }}
      >Remove</button>
    </div>
  );
}