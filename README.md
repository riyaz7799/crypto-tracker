# CryptoTrack — Real-Time Cryptocurrency Dashboard

A production-grade crypto tracking dashboard built with React, Zustand, WebSockets, and Docker.

![CryptoTrack Dashboard](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![Docker](https://img.shields.io/badge/Docker-ready-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

## Features
- 🔴 **Live prices** via Binance WebSocket API
- 📊 **Top 100 coins** from CoinGecko REST API
- 📈 **Interactive SVG charts** with time range selection
- 💼 **Portfolio tracker** with P&L calculation
- 🔔 **Price alerts** with visual notifications
- 🌙 **Dark / Light theme** toggle
- 🐳 **Fully containerized** with Docker + Nginx
- ⚡ **State management** with Zustand
- 💾 **Persistent storage** via localStorage

## Tech Stack
| Tool | Purpose |
|------|---------|
| React 18 + Vite | UI framework |
| Zustand | Global state management |
| Tailwind CSS v3 | Styling |
| Binance WebSocket | Real-time price stream |
| CoinGecko API | Initial coin data |
| Docker + Nginx | Containerization |

## Quick Start with Docker

```bash
# 1. Clone the repo
git clone https://github.com/riyaz7799/crypto-tracker.git
cd crypto-tracker

# 2. Copy env file
cp .env.example .env

# 3. Run with Docker
docker-compose up --build

# App available at http://localhost:8080
```

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# App available at http://localhost:3000
```

## Environment Variables

```bash
VITE_BINANCE_WS_URL=wss://stream.binance.com:9443/ws
VITE_COINGECKO_API_URL=https://api.coingecko.com/api/v3
```

## Project Structure

```
crypto-tracker/
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── nginx/
│   └── nginx.conf
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Portfolio.jsx
│   │   └── DetailView.jsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── ThemeSwitcher.jsx
│   │   ├── crypto/
│   │   │   ├── CryptoTable.jsx
│   │   │   ├── CryptoTableRow.jsx
│   │   │   ├── SearchInput.jsx
│   │   │   └── Sparkline.jsx
│   │   ├── portfolio/
│   │   │   ├── PortfolioModal.jsx
│   │   │   └── PortfolioItem.jsx
│   │   ├── alerts/
│   │   │   ├── AlertManager.jsx
│   │   │   └── AlertNotification.jsx
│   │   └── ui/
│   │       ├── Modal.jsx
│   │       └── ErrorBoundary.jsx
│   ├── store/
│   │   └── useCryptoStore.js
│   ├── hooks/
│   │   └── useWebSocket.js
│   ├── services/
│   │   └── coinGeckoService.js
│   └── utils/
│       ├── localStorage.js
│       └── formatters.js
├── package.json
└── README.md
```

## Core Requirements Implemented

| # | Requirement | Status |
|---|-------------|--------|
| 1 | Docker + docker-compose on port 8080 | ✅ |
| 2 | .env.example with required variables | ✅ |
| 3 | Fetch & display 10+ cryptocurrencies | ✅ |
| 4 | Real-time search/filter input | ✅ |
| 5 | WebSocket connection + window.getWebSocketState() | ✅ |
| 6 | Live price updates from WebSocket | ✅ |
| 7 | Sparkline chart per coin row | ✅ |
| 8 | 24h change with data-direction attribute | ✅ |
| 9 | Portfolio in localStorage (cryptoPortfolio) | ✅ |
| 10 | Portfolio view with data-testid attributes | ✅ |
| 11 | Portfolio total value + P&L display | ✅ |
| 12 | Detail view with price chart | ✅ |
| 13 | Price alerts in localStorage (cryptoAlerts) | ✅ |
| 14 | Alert notifications when price crossed | ✅ |
| 15 | Light/Dark theme toggle on html element | ✅ |