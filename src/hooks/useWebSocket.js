import { useEffect, useRef } from 'react';
import useCryptoStore from '../store/useCryptoStore';

const WS_URL = import.meta.env.VITE_BINANCE_WS_URL || 'wss://stream.binance.com:9443/ws';

const useWebSocket = (symbols = []) => {
  const ws = useRef(null);
  const retryTimeout = useRef(null);
  const retryCount = useRef(0);
  const setWsStatus = useCryptoStore((s) => s.setWsStatus);
  const updatePrice = useCryptoStore((s) => s.updatePrice);

  const connect = () => {
    if (!symbols.length) return;
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      retryCount.current = 0;
      setWsStatus('OPEN');
      window.getWebSocketState = () => 'OPEN';

      const streams = symbols.map((s) => `${s.toLowerCase()}@ticker`);
      ws.current.send(JSON.stringify({ method: 'SUBSCRIBE', params: streams, id: 1 }));
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.s && data.c) {
          updatePrice(data.s, data.c);
        }
      } catch {}
    };

    ws.current.onerror = () => setWsStatus('CLOSED');

    ws.current.onclose = () => {
      setWsStatus('CLOSED');
      window.getWebSocketState = () => 'CLOSED';
      const delay = Math.min(1000 * 2 ** retryCount.current, 30000);
      retryCount.current += 1;
      retryTimeout.current = setTimeout(connect, delay);
    };

    setWsStatus('CONNECTING');
    window.getWebSocketState = () => {
      const states = { 0: 'CONNECTING', 1: 'OPEN', 2: 'CLOSING', 3: 'CLOSED' };
      return ws.current ? states[ws.current.readyState] : 'CLOSED';
    };
  };

  useEffect(() => {
    if (!symbols.length) return;
    connect();
    return () => {
      clearTimeout(retryTimeout.current);
      if (ws.current) ws.current.close();
    };
  }, [symbols.join(',')]);
};

export default useWebSocket;