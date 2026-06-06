import useCryptoStore from '../../store/useCryptoStore';
import CryptoTableRow from './CryptoTableRow';
import SearchInput from './SearchInput';

const HEADERS = [
  { label: '#', align: 'left', width: 52 },
  { label: 'Asset', align: 'left' },
  { label: 'Price', align: 'right' },
  { label: '24h %', align: 'right' },
  { label: 'Market Cap', align: 'right' },
  { label: 'Volume 24h', align: 'right' },
  { label: '7D Chart', align: 'right' },
];

export default function CryptoTable() {
  const { coins, searchQuery } = useCryptoStore();

  const filtered = coins.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q);
  });

  return (
    <div className="card fade-up delay-5" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '18px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14,
      }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: 17 }}>Live Prices</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 3 }}>
            {filtered.length} of {coins.length} assets shown
          </p>
        </div>
        <SearchInput />
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
              {HEADERS.map((h) => (
                <th key={h.label} style={{
                  padding: '9px 16px',
                  textAlign: h.align,
                  fontSize: 10, fontWeight: 700,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.9px',
                  textTransform: 'uppercase',
                  fontFamily: 'Space Mono, monospace',
                  whiteSpace: 'nowrap',
                }}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No results for "<strong>{searchQuery}</strong>"</p>
                </td>
              </tr>
            ) : (
              filtered.map((coin, i) => (
                <CryptoTableRow key={coin.id} coin={coin} rank={i + 1} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {filtered.length > 0 && (
        <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <p className="num" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Powered by CoinGecko API + Binance WebSocket
          </p>
        </div>
      )}
    </div>
  );
}