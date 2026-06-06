import { create } from 'zustand';
import { getPortfolio, savePortfolio, getAlerts, saveAlerts } from '../utils/localStorage';

const useCryptoStore = create((set, get) => ({
  coins: [],
  prices: {},
  wsStatus: 'CLOSED',
  portfolio: getPortfolio(),
  alerts: getAlerts(),
  triggeredAlerts: {},
  searchQuery: '',
  isDark: true,

  setCoins: (coins) => set({ coins }),

  updatePrice: (symbol, price) => {
    const upperSymbol = symbol.toUpperCase();
    set((state) => ({ prices: { ...state.prices, [upperSymbol]: price } }));
    const { alerts, triggeredAlerts } = get();
    alerts.forEach((alert) => {
      const alertSymbol = (alert.id + 'usdt').toUpperCase();
      if (alertSymbol !== upperSymbol) return;
      const currentPrice = parseFloat(price);
      const triggered =
        (alert.condition === 'above' && currentPrice >= alert.targetPrice) ||
        (alert.condition === 'below' && currentPrice <= alert.targetPrice);
      if (triggered && !triggeredAlerts[alert.id]) {
        set((state) => ({ triggeredAlerts: { ...state.triggeredAlerts, [alert.id]: true } }));
      }
    });
  },

  setWsStatus: (wsStatus) => set({ wsStatus }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  toggleTheme: () => {
    set((state) => {
      const newDark = !state.isDark;
      if (newDark) {
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
      }
      return { isDark: newDark };
    });
  },

  addToPortfolio: (item) => {
    const portfolio = get().portfolio;
    const existing = portfolio.findIndex((p) => p.id === item.id);
    let updated;
    if (existing >= 0) updated = portfolio.map((p, i) => i === existing ? { ...p, ...item } : p);
    else updated = [...portfolio, item];
    savePortfolio(updated);
    set({ portfolio: updated });
  },

  removeFromPortfolio: (id) => {
    const updated = get().portfolio.filter((p) => p.id !== id);
    savePortfolio(updated);
    set({ portfolio: updated });
  },

  addAlert: (alert) => {
    const alerts = [...get().alerts, alert];
    saveAlerts(alerts);
    set({ alerts });
  },

  removeAlert: (id) => {
    const alerts = get().alerts.filter((a) => a.id !== id);
    saveAlerts(alerts);
    set({ alerts });
  },

  dismissAlert: (id) => {
    set((state) => {
      const triggered = { ...state.triggeredAlerts };
      delete triggered[id];
      return { triggeredAlerts: triggered };
    });
  },
}));

export default useCryptoStore;