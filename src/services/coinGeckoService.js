const BASE_URL = import.meta.env.VITE_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';

export const fetchTopCoins = async (page = 1, perPage = 100) => {
  const res = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h`
  );
  if (!res.ok) throw new Error('Failed to fetch coins');
  return res.json();
};

export const fetchCoinDetail = async (id) => {
  const res = await fetch(`${BASE_URL}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`);
  if (!res.ok) throw new Error('Failed to fetch coin detail');
  return res.json();
};

export const fetchCoinHistory = async (id, days = 7) => {
  const res = await fetch(`${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
};