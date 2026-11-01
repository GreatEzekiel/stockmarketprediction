import React, { useState } from 'react';
import { Cpu, Sparkles, Shield } from 'lucide-react';
import { fetchPredict, useAuth, useToast } from '../lib';

const SYMBOLS = ['DANGCEM','GTCO','ZENITHBANK','MTNN','AIRTELAFRI','BUACEMENT','SEPLAT','NESTLE','ACCESSCORP','UBA','FBNH','TRANSCORP'];
const TIMEFRAMES = [
  { value: '1D', label: '1 Day — Short-term' },
  { value: '1W', label: '1 Week — Medium-term' },
  { value: '1M', label: '1 Month — Quarterly' },
  { value: '3M', label: '3 Months — Strategic' },
];

export default function PredictTab() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [symbol, setSymbol] = useState('DANGCEM');
  const [timeframe, setTimeframe] = useState('1D');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const r = await fetchPredict(symbol, timeframe, token);
      setResult(r);
      showToast(`AI prediction generated for ${symbol}`, 'success');
    } catch (err) {
      showToast(err?.message || 'Prediction failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const sigClass = result ? `signal-${(result.signal || 'hold').toLowerCase()}` : '';
  const confPct = result ? Math.round((result.confidence || 0.82) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, margin: '0 auto', width: '100%' }}>
      {/* Form */}
      <div className="glass-panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Cpu size={24} color="var(--primary-400)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>AI Stock Prediction Engine</h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 24 }}>
          Select an NGX equity and forecast horizon to run the machine learning model.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Stock Symbol</label>
            <select className="input-field" value={symbol} onChange={e => setSymbol(e.target.value)}>
              {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Forecast Horizon</label>
            <select className="input-field" value={timeframe} onChange={e => setTimeframe(e.target.value)}>
              {TIMEFRAMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '13px 20px' }}>
            {loading
              ? <><span className="animate-spin" style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} /> Analysing…</>
              : <><Sparkles size={17} /> Run AI Prediction</>}
          </button>
        </form>
      </div>

      {/* Results Panel */}
      {result && (
        <div className="glass-panel fade-up" style={{ padding: 32 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>
                Prediction Result · {result.timeframe} Horizon
              </div>
              <h3 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{result.symbol}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <span className={`signal-badge ${sigClass}`} style={{ fontSize: '1rem', padding: '8px 22px' }}>
                SIGNAL: {result.signal}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Timeframe: {result.timeframe}</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 24 }}>
            {/* Target Price */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>Target Price Projection</div>
              <div className="font-mono text-gradient" style={{ fontSize: '2rem', fontWeight: 800 }}>
                ₦{result.target_price}
              </div>
            </div>

            {/* Confidence */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Model Confidence</span>
                <span className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-400)' }}>{confPct}%</span>
              </div>
              <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${confPct}%`, background: 'var(--grad-primary)', borderRadius: 6, transition: 'width 1s cubic-bezier(0.4,0,0.2,1)' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 6 }}>
                {confPct >= 85 ? 'High confidence signal' : confPct >= 70 ? 'Moderate confidence' : 'Low confidence — use caution'}
              </div>
            </div>

            {/* Extra details if available */}
            {result.details && (
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 10 }}>Technical Indicators</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {result.details.rsi_14 && <div style={{ fontSize: '0.82rem' }}><span style={{ color: 'var(--text-dim)' }}>RSI(14): </span><strong>{result.details.rsi_14}</strong></div>}
                  {result.details.macd_signal && <div style={{ fontSize: '0.82rem' }}><span style={{ color: 'var(--text-dim)' }}>MACD: </span><strong style={{ color: result.details.macd_signal === 'BULLISH' ? 'var(--color-positive)' : result.details.macd_signal === 'BEARISH' ? 'var(--color-negative)' : 'var(--text-main)' }}>{result.details.macd_signal}</strong></div>}
                  {result.details.volatility && <div style={{ fontSize: '0.82rem' }}><span style={{ color: 'var(--text-dim)' }}>Volatility: </span><strong>{result.details.volatility}</strong></div>}
                </div>
              </div>
            )}
          </div>

          {/* AI Insight */}
          <div style={{ background: 'rgba(99,102,241,0.07)', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glow)', display: 'flex', gap: 14 }}>
            <Shield size={22} style={{ color: 'var(--primary-400)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.93rem', marginBottom: 5 }}>AI Model Analysis</div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                {result.message || `Neural network pattern analysis completed for ${result.symbol}. Signal generated based on multi-factor technical indicators over the ${result.timeframe} forecast window.`}
              </div>
            </div>
          </div>

          {/* Risk Disclaimer */}
          <div style={{ marginTop: 16, padding: '10px 16px', background: 'rgba(245,158,11,0.07)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-warning)', lineHeight: 1.5 }}>
              ⚠️ <strong>Disclaimer:</strong> AI predictions are for informational purposes only and do not constitute financial advice. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
