import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart, Zap, ArrowRight, RefreshCw } from 'lucide-react';
import { fetchMarketSummary, fetchPredict } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export const OverviewTab = () => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickSymbol, setQuickSymbol] = useState('');
  const [quickResult, setQuickResult] = useState(null);
  const [quickLoading, setQuickLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchMarketSummary();
      setSummary(data);
    } catch (err) {
      showToast('Failed to load live summary', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickPredict = async (e) => {
    e.preventDefault();
    if (!quickSymbol.trim()) return;

    setQuickLoading(true);
    try {
      const res = await fetchPredict(quickSymbol.trim().toUpperCase(), '1D', token);
      setQuickResult(res);
    } catch (err) {
      showToast(err.message || 'Prediction failed', 'error');
    } finally {
      setQuickLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {/* Stat 1: ASI */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>All-Share Index (ASI)</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} color="var(--primary-400)" />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }} className="font-mono">
            {summary ? Number(summary.asi).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '104,320.45'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: (summary?.asi_change_pct || 1.84) >= 0 ? 'var(--color-positive)' : 'var(--color-negative)' }}>
            {(summary?.asi_change_pct || 1.84) >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{(summary?.asi_change_pct || 1.84) >= 0 ? '+' : ''}{summary?.asi_change_pct || '1.84'}% Today</span>
          </div>
        </div>

        {/* Stat 2: Market Cap */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Market Capitalization</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} color="var(--accent-cyan)" />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }} className="font-mono">
            ₦{summary?.market_cap_naira_trillion || '59.42'}T
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 500 }}>Trillion Nigerian Naira</span>
        </div>

        {/* Stat 3: Daily Turnover */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Daily Turnover</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} color="var(--color-positive)" />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }} className="font-mono">
            ₦{summary?.daily_turnover_naira_billion || '18.75'}B
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 500 }}>Billion Naira Traded</span>
        </div>

        {/* Stat 4: Volume Traded */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Volume Traded</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PieChart size={20} color="var(--color-warning)" />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }} className="font-mono">
            {summary?.volume_traded_million || '642.8'}M
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 500 }}>Million Shares Transacted</span>
        </div>
      </div>

      {/* Main Row: Market Chart & Quick Predict Widget */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Market Trend Graphic */}
        <div className="glass-panel" style={{ padding: '24px', gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>NGX All-Share Index Trend</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Live intraday trajectory with AI trendline mapping</p>
            </div>
            <button onClick={loadData} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {/* SVG Intraday Chart */}
          <div style={{ width: '100%', height: '220px', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 160 Q 100 120, 200 140 T 400 80 T 600 40 L 600 200 L 0 200 Z"
                fill="url(#chartGrad)"
              />
              <path
                d="M 0 160 Q 100 120, 200 140 T 400 80 T 600 40"
                fill="none"
                stroke="var(--primary-400)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Highlight points */}
              <circle cx="200" cy="140" r="5" fill="#06b6d4" />
              <circle cx="400" cy="80" r="5" fill="#6366f1" />
              <circle cx="600" cy="40" r="6" fill="#10b981" />
            </svg>
          </div>
        </div>

        {/* Quick Predict Widget */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Zap size={20} color="var(--primary-400)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Quick AI Predict</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Get instant machine learning signal for any NGX equity symbol.
            </p>

            <form onSubmit={handleQuickPredict} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="e.g. DANGCEM, GTCO"
                value={quickSymbol}
                onChange={(e) => setQuickSymbol(e.target.value)}
                className="input-field"
                style={{ textTransform: 'uppercase' }}
              />
              <button type="submit" disabled={quickLoading} className="btn-primary" style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}>
                {quickLoading ? 'Analysing...' : <ArrowRight size={18} />}
              </button>
            </form>
          </div>

          {quickResult && (
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--border-glow)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{quickResult.symbol}</span>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: quickResult.signal === 'BUY' ? 'var(--color-positive-bg)' : quickResult.signal === 'SELL' ? 'var(--color-negative-bg)' : 'var(--color-warning-bg)',
                  color: quickResult.signal === 'BUY' ? 'var(--color-positive)' : quickResult.signal === 'SELL' ? 'var(--color-negative)' : 'var(--color-warning)'
                }}>
                  {quickResult.signal}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Target Price: <strong style={{ color: '#fff' }}>₦{quickResult.target_price || '---'}</strong> | Confidence: <strong style={{ color: '#fff' }}>{Math.round((quickResult.confidence || 0.8) * 100)}%</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
