export const getPortfolio = () => {
  try {
    const data = localStorage.getItem('cryptoPortfolio');
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

export const savePortfolio = (portfolio) => {
  try {
    localStorage.setItem('cryptoPortfolio', JSON.stringify(portfolio));
  } catch {}
};

export const getAlerts = () => {
  try {
    const data = localStorage.getItem('cryptoAlerts');
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

export const saveAlerts = (alerts) => {
  try {
    localStorage.setItem('cryptoAlerts', JSON.stringify(alerts));
  } catch {}
};