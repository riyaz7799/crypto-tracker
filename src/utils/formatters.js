export const formatPrice = (price) => {
  if (!price) return '$0.00';
  const num = parseFloat(price);
  if (num >= 1) return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + num.toFixed(6);
};

export const formatPercent = (val) => {
  if (val === undefined || val === null) return '0.00%';
  return (parseFloat(val) >= 0 ? '+' : '') + parseFloat(val).toFixed(2) + '%';
};

export const formatMarketCap = (val) => {
  if (!val) return '$0';
  if (val >= 1e12) return '$' + (val / 1e12).toFixed(2) + 'T';
  if (val >= 1e9) return '$' + (val / 1e9).toFixed(2) + 'B';
  if (val >= 1e6) return '$' + (val / 1e6).toFixed(2) + 'M';
  return '$' + val.toLocaleString();
};