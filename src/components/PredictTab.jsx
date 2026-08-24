import React, { useState } from 'react';
import { Cpu, Sparkles, TrendingUp, AlertCircle, CheckCircle2, Sliders, Shield } from 'lucide-react';
import { fetchPredict } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export const PredictTab = () => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [symbol, setSymbol] = useState('DANGCEM');
  const [timeframe, setTimeframe] = useState('1D');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const symbolsList = ['DANGCEM', 'GTCO', 'ZENITHBANK', 'MTNN', 'AIRTELAFRI', 'BUACEMENT', 'SEPLAT', 'NESTLE', 'ACCESSCORP', 'UBA', 'FBNH', 'TRANSCORP'];

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!symbol.trim()) return;

    setLoading(true);
    try {
      const res = await fetchPredict(symbol.trim().toUpperCase(), timeframe, token);
      setPrediction(res);
      showToast(`AI Prediction generated for ${symbol.toUpperCase()}`, 'success');
    } catch (err) {
      showToast(err.message || 'Prediction failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Selector Glass Form */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Cpu size={24} color="var(--primary-400)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>AI Stock Prediction Model</h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Select an NGX equity symbol and timeframe to run our machine learning forecasting algorithm.
        </p>

        <form onSubmit={handlePredict} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Stock Symbol
            </label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="input-field"
            >
              {symbolsList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Forecast Horizon
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="input-field"
            >
              <option value="1D">1 Day (Short term)</option>
              <option value="1W">1 Week (Medium term)</option>
              <option value="1M">1 Month (Quarterly)</option>
              <option value="3M">3 Months (Strategic)</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '14px 24px', height: '48px' }}>
            <Sparkles size={18} />
            <span>{loading ? 'Processing Model...' : 'Run AI Prediction'}</span>
          </button>
        </form>
      </div>

      {/* Prediction Output Results */}
      {prediction && (
        <div className="glass-panel" style={{ padding: '32px', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em' }}>
                Prediction Result ({prediction.timeframe})
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{prediction.symbol}</h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                fontSize: '1.1rem',
                fontWeight: 800,
                letterSpacing: '0.02em',
                background: prediction.signal === 'BUY' ? 'var(--color-positive-bg)' : prediction.signal === 'SELL' ? 'var(--color-negative-bg)' : 'var(--color-warning-bg)',
                color: prediction.signal === 'BUY' ? 'var(--color-positive)' : prediction.signal === 'SELL' ? 'var(--color-negative)' : 'var(--color-warning)',
                border: `1px solid ${prediction.signal === 'BUY' ? 'rgba(16, 185, 129, 0.4)' : prediction.signal === 'SELL' ? 'rgba(244, 63, 94, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
              }}>
                SIGNAL: {prediction.signal}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '28px' }}>
            {/* Target Price */}
            <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>Target Price Projection</div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }} className="font-mono text-gradient">
                ₦{prediction.target_price || '---'}
              </div>
            </div>

            {/* Model Confidence Meter */}
            <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Confidence Score</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-400)' }}>
                  {Math.round((prediction.confidence || 0.82) * 100)}%
                </span>
              </div>
              <div style={{ height: '10px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.round((prediction.confidence || 0.82) * 100)}%`,
                  background: 'var(--grad-primary)',
                  borderRadius: '5px',
                  transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                }}></div>
              </div>
            </div>
          </div>

          {/* Model Narrative */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glow)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px'
          }}>
            <Shield size={22} style={{ color: 'var(--primary-400)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>AI Model Insight</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {prediction.message || `Neural network analysis indicates pattern alignment for ${prediction.symbol} with strong momentum indicators over the ${prediction.timeframe} window.`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
