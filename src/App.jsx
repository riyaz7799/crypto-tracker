import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import DetailView from './pages/DetailView';
import AlertNotification from './components/alerts/AlertNotification';
import ErrorBoundary from './components/ui/ErrorBoundary';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <AlertNotification />
      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '28px 24px' }}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/coin/:id" element={<DetailView />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}