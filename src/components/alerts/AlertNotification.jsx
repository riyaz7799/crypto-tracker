import useCryptoStore from '../../store/useCryptoStore';
import { formatPrice } from '../../utils/formatters';

export default function AlertNotification() {
  const { triggeredAlerts, alerts, coins, dismissAlert } = useCryptoStore();

  const triggered = Object.keys(triggeredAlerts).filter((id) => triggeredAlerts[id]);
  if (!triggered.length) return null;

  return (
    <div style={{ position: 'fixed', top: 72, right: 20, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {triggered.map((id) => {
        const alert = alerts.find((a) => a.id === id);
        const coin = coins.find((c) => c.id === id);
        return (
          <div
            key={id}
            data-testid={`alert-notification-${id}`}
            className="slide-in"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--accent-yellow)',
              borderRadius: 12,
              padding: '14px 18px',
              minWidth: 280,
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>🔔</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Alert Triggered!</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {coin?.name || id} price {alert?.condition} {alert ? formatPrice(alert.targetPrice) : ''}
                </div>
              </div>
            </div>
            <button onClick={() => dismissAlert(id)} style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', fontSize: 20,
            }}>×</button>
          </div>
        );
      })}
    </div>
  );
}