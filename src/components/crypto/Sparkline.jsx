export default function Sparkline({ data = [], symbol, width = 100, height = 36 }) {
  if (!data || data.length < 2) {
    return <svg data-testid={`sparkline-${symbol}`} width={width} height={height} />;
  }

  const prices = data.slice(-30);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const isUp = prices[prices.length - 1] >= prices[0];

  const points = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const fillPoints = `0,${height} ${points} ${width},${height}`;
  const color = isUp ? '#00ff87' : '#ff3d6b';
  const fillColor = isUp ? 'rgba(0,255,135,0.08)' : 'rgba(255,61,107,0.08)';

  return (
    <svg
      data-testid={`sparkline-${symbol}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`grad-${symbol}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill={`url(#grad-${symbol})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}