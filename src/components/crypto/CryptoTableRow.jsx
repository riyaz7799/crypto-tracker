import { memo, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCryptoStore from '../../store/useCryptoStore';
import Sparkline from './Sparkline';
import { formatPrice, formatPercent, formatMarketCap } from '../../utils/formatters';

const CryptoTableRow = memo(({ coin, rank }) => {
  const navigate = useNavigate();
  const livePrice = useCryptoStore((s) => s.prices[coin.symbol.toUpperCase() + 'USDT']);
  const prevPrice = useRef(null);
  const [flash, setFlash] = useState('');

  const price = livePrice ? parseFloat(livePrice) : coin.current_price;
  const change = coin.price_change_percentage_24h || 0;
  const isUp = change >= 0;
  const symbol = coin.symbol.toUpperCase() + 'USDT';

  useEffect(() => {
    if (prevPrice.current === null) { prevPrice.current = price; return; }
    if (price !== prevPrice.current) {
      setFlash(price > prevPrice.current ? 'flash-green' : 'flash-red');
      prevPrice.current = price;
      const t = setTimeout(() => setFlash(''), 800);
      return () => clearTimeout(t);
    }
  }, [price]);

  return (
    <tr
      data-testid={`crypto-row-${symbol}`}
      className="table-row"
      onClick={() => navigate(`/coin/${coin.id}`)}
      style={{ cursor: 'pointer' }}
    >
      {/* Rank */}
      <td style={{ padding: '13px 16px 13px 20px', width: 52 }}>
        <span className="num" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{rank}</span>
      </td>

      {/* Coin */}
      <td style={{ padding: '13px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <img src={coin.image} alt={coin.name} width={32} height={32} style={{ borderRadius: '50%', flexShrink: 0 }} loading="lazy" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>{coin.name}</div>
            <div className="num" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {coin.symbol.toUpperCase()}
            </div>
          </div>
        </div>
      </td>

      {/* Price */}
      <td style={{ padding: '13px 16px', textAlign: 'right' }}>
        <span
          data-testid={`price-${symbol}`}
          className={`num ${flash}`}
          style={{ fontWeight: 700, fontSize: 14, display: 'inline-block', borderRadius: 4, padding: '2px 4px', transition: 'color 0.3s' }}
        >
          {formatPrice(price)}
        </span>
      </td>

      {/* 24h Change */}
      <td style={{ padding: '13px 16px', textAlign: 'right' }}>
        <span
          data-testid={`price-change-24h-${symbol}`}
          data-direction={isUp ? 'up' : 'down'}
          className={`badge ${isUp ? 'badge-up' : 'badge-down'}`}
        >
          {isUp ? '▲' : '▼'} {formatPercent(change).replace('+', '').replace('-', '')}
        </span>
      </td>

      {/* Market Cap */}
      <td style={{ padding: '13px 16px', textAlign: 'right' }}>
        <span className="num" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {formatMarketCap(coin.market_cap)}
        </span>
      </td>

      {/* Volume */}
      <td style={{ padding: '13px 16px', textAlign: 'right' }}>
        <span className="num" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {formatMarketCap(coin.total_volume)}
        </span>
      </td>

      {/* Sparkline */}
      <td style={{ padding: '13px 20px 13px 8px', textAlign: 'right' }}>
        <Sparkline data={coin.sparkline_in_7d?.price} symbol={symbol} width={108} height={38} />
      </td>
    </tr>
  );
});

export default CryptoTableRow;