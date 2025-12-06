import React from 'react'
import { Link } from 'react-router-dom'
import { logger } from '../utils/logger'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    })
    
    // Production-ben küldjük a hibát egy error tracking szolgáltatásnak
    if (import.meta.env.PROD) {
      logger.error('Error caught by boundary:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ color: 'var(--accent)', marginBottom: '16px' }}>Hiba történt</h2>
            <p className="muted" style={{ marginBottom: '24px' }}>
              Sajnáljuk, valami hiba történt az alkalmazás betöltése során.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details style={{ marginBottom: '24px', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>Hibadetails (csak fejlesztői módban)</summary>
                <pre style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  fontSize: '12px',
                  overflow: 'auto',
                  maxHeight: '300px'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                className="btn" 
                onClick={() => window.location.reload()}
              >
                Oldal újratöltése
              </button>
              <Link to="/" className="btn-ghost">
                Vissza a főoldalra
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

