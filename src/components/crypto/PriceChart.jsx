import { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

export default function PriceChart({ data = [], symbol }) {
  const containerRef = useRef(null);
  const chartRef     = useRef(null);
  const seriesRef    = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    chartRef.current = createChart(containerRef.current, {
      width:  containerRef.current.clientWidth,
      height: 340,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor:  '#9090b0',
        fontFamily: "'Space Mono', monospace",
        fontSize:   11,
      },
      grid: {
        vertLines: { color: 'rgba(30,30,46,0.8)' },
        horzLines: { color: 'rgba(30,30,46,0.8)' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color:'#3d8bff', width:1, style:3, labelBackgroundColor:'#111118' },
        horzLine: { color:'#3d8bff', width:1, style:3, labelBackgroundColor:'#111118' },
      },
      rightPriceScale: { borderColor:'#1e1e2e' },
      timeScale:       { borderColor:'#1e1e2e', timeVisible:true, secondsVisible:false },
      handleScroll:    { mouseWheel:true, pressedMouseMove:true },
      handleScale:     { mouseWheel:true, pinch:true },
    });

    seriesRef.current = chartRef.current.addAreaSeries({
      lineColor:                    '#3d8bff',
      topColor:                     'rgba(61,139,255,0.22)',
      bottomColor:                  'rgba(61,139,255,0.0)',
      lineWidth:                    2,
      crosshairMarkerVisible:       true,
      crosshairMarkerRadius:        5,
      crosshairMarkerBorderColor:   '#3d8bff',
      crosshairMarkerBackgroundColor:'#111118',
      priceLineVisible:             true,
      priceLineColor:               '#3d8bff',
      priceLineStyle:               3,
    });

    const ro = new ResizeObserver(() => {
      if (chartRef.current && containerRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
      }
    });
    ro.observe(containerRef.current);

    return () => { ro.disconnect(); chartRef.current?.remove(); };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !data?.length) return;

    // deduplicate + sort by timestamp
    const seen = new Set();
    const formatted = data
      .map(([ts, value]) => ({ time: Math.floor(ts / 1000), value: parseFloat(value) }))
      .sort((a, b) => a.time - b.time)
      .filter(p => { if (seen.has(p.time)) return false; seen.add(p.time); return true; });

    if (formatted.length) {
      seriesRef.current.setData(formatted);
      chartRef.current?.timeScale().fitContent();
    }
  }, [data]);

  return (
    <div
      ref={containerRef}
      data-testid="price-chart"
      style={{ width:'100%', borderRadius:8, overflow:'hidden', minHeight:340 }}
    />
  );
}