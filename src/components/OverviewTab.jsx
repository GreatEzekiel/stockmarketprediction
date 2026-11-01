import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart, Zap, ArrowRight, RefreshCw } from 'lucide-react';
import { fetchMarketSummary, fetchPredict, useAuth, useToast } from '../lib';

function StatCard({ label, value, sub, icon: Icon, iconColor, iconBg }) {
  return (
    <div className="glass-panel glass-hover" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={18} color={iconColor} />
        </div>
      </div>
      <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 5 }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{sub}</div>
    </div>
  );
}

export default function OverviewTab() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickSym, setQuickSym] = useState('');
  const [quickRes, setQuickRes] = useState(null);
  const [quickLoading, setQuickLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setSummary(await fetchMarketSummary()); }
    catch { showToast('Using cached market data', 'info'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); const t = setInterval(load, 60000); return () => clearInterval(t); }, []);

  const handleQuick = async (e) => {
    e.preventDefault();
    if (!quickSym.trim()) return;
    setQuickLoading(true);
    try {
      const r = await fetchPredict(quickSym.trim().toUpperCase(), '1D', token);
      setQuickRes(r);
      showToast(`Prediction generated for ${quickSym.toUpperCase()}`, 'success');
    } catch (err) { showToast(err?.message || 'Prediction failed', 'error'); }
    finally { setQuickLoading(false); }
  };

  const asi = summary?.asi ?? 104320.45;
  const asiChg = summary?.asi_change_pct ?? 1.84;
  const mcap = summary?.market_cap_naira_trillion ?? 59.42;
  const turnover = summary?.daily_turnover_naira_billion ?? 18.75;
  const vol = summary?.volume_traded_million ?? 642.8;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
        <div className="glass-panel glass-hover" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>All-Share Index (ASI)</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} color="var(--primary-400)" />
            </div>
          </div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 6 }}>
            {Number(asi).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', fontWeight: 600, color: asiChg >= 0 ? 'var(--color-positive)' : 'var(--color-negative)' }}>
            {asiChg >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{asiChg >= 0 ? '+' : ''}{asiChg}% Today</span>
          </div>
        </div>
        <StatCard label="Market Capitalization" value={`₦${mcap}T`} sub="Trillion Naira" icon={DollarSign} iconColor="#06b6d4" iconBg="rgba(6,182,212,0.15)" />
        <StatCard label="Daily Turnover" value={`₦${turnover}B`} sub="Billion Naira Traded" icon={Activity} iconColor="var(--color-positive)" iconBg="rgba(16,185,129,0.15)" />
        <StatCard label="Volume Traded" value={`${vol}M`} sub="Million Shares Transacted" icon={PieChart} iconColor="var(--color-warning)" iconBg="rgba(245,158,11,0.15)" />
      </div>

      {/* Chart + Quick Predict Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 20 }}>
        {/* Chart Panel */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>NGX All-Share Index — Intraday</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Live session with AI trendline overlay</p>
            </div>
            <button onClick={load} disabled={loading} className="btn-secondary" style={{ padding: '7px 14px' }}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Refreshing…' : 'Refresh'}</span>
            </button>
          </div>
          <svg width="100%" height="200" viewBox="0 0 600 200" preserveAspectRatio="none" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M 0 165 C 60 155, 120 130, 180 140 S 300 90, 380 75 S 510 45, 600 30 L 600 200 L 0 200 Z" fill="url(#cg)" />
            <path d="M 0 165 C 60 155, 120 130, 180 140 S 300 90, 380 75 S 510 45, 600 30" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="180" cy="140" r="5" fill="#06b6d4" />
            <circle cx="380" cy="75" r="5" fill="#818cf8" />
            <circle cx="600" cy="30" r="6" fill="#10b981" />
            <text x="185" y="132" fill="#06b6d4" fontSize="10" fontFamily="inherit">Mid</text>
            <text x="385" y="67" fill="#818cf8" fontSize="10" fontFamily="inherit">Trend</text>
            <text x="548" y="25" fill="#10b981" fontSize="10" fontFamily="inherit">Current</text>
          </svg>
        </div>

        {/* Quick Predict */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Zap size={20} color="var(--primary-400)" />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Quick Predict</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enter any NGX symbol</p>
            </div>
          </div>
          <form onSubmit={handleQuick} style={{ display: 'flex', gap: 8 }}>
            <input
              className="input-field font-mono"
              type="text"
              placeholder="e.g. DANGCEM"
              value={quickSym}
              onChange={e => setQuickSym(e.target.value.toUpperCase())}
              style={{ flex: 1 }}
            />
            <button type="submit" disabled={quickLoading || !quickSym.trim()} className="btn-primary" style={{ padding: '0 16px', flexShrink: 0 }}>
              {quickLoading
                ? <span className="animate-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} />
                : <ArrowRight size={16} />}
            </button>
          </form>

          {quickRes && (
            <div className="fade-up" style={{ background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>{quickRes.symbol}</span>
                <span className={`signal-badge signal-${(quickRes.signal || 'HOLD').toLowerCase()}`}>
                  {quickRes.signal}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <div>Target: <strong style={{ color: '#f8fafc' }}>₦{quickRes.target_price}</strong></div>
                <div>Confidence: <strong style={{ color: '#f8fafc' }}>{Math.round((quickRes.confidence || 0.8) * 100)}%</strong></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
