import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 40, textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
        }}>
          <div style={{ fontSize: 48 }}>💥</div>
          <h2 style={{ color: 'var(--accent-red)', fontWeight: 800 }}>Something went wrong</h2>
          <pre style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 8, padding: 16, fontSize: 12,
            color: 'var(--accent-red)', maxWidth: 600, overflowX: 'auto',
            textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-all'
          }}>
            {this.state.error?.message}
            {'\n'}
            {this.state.error?.stack}
          </pre>
          <button className="btn btn-primary" onClick={() => window.history.back()}>← Go Back</button>
        </div>
      );
    }
    return this.props.children;
  }
}