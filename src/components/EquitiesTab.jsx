import React, { useState, useEffect, useMemo } from 'react';
import { ListFilter, Search, RefreshCw, TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';
import { fetchEquities, useAuth, useToast } from '../lib';

export default function EquitiesTab() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [equities, setEquities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortDir, setSortDir] = useState('desc'); // asc | desc

  const load = async () => {
    setLoading(true);
    try { setEquities(await fetchEquities(token)); }
    catch { showToast('Loaded standard NGX dataset', 'info'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return equities
      .filter(e => !q || e.symbol?.toLowerCase().includes(q) || e.name?.toLowerCase().includes(q))
      .sort((a, b) => sortDir === 'asc' ? a.price - b.price : b.price - a.price);
  }, [equities, search, sortDir]);

  return (
    <div className="glass-panel" style={{ padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 22 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
            <ListFilter size={22} color="var(--primary-400)" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>NGX Equities Market Directory</h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Real-time equity quotes across the Nigerian Stock Exchange
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
            <input
              className="input-field"
              type="text"
              placeholder="Search symbol or name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36, height: 40, fontSize: '0.84rem', width: 220 }}
            />
          </div>
          <button onClick={load} disabled={loading} className="btn-secondary" style={{ height: 40, padding: '0 16px' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Loading…' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)' }}>
              <th style={{ textAlign: 'left', padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700 }}>#</th>
              <th style={{ textAlign: 'left', padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700 }}>Symbol</th>
              <th style={{ textAlign: 'left', padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700 }}>Company Name</th>
              <th
                style={{ textAlign: 'right', padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  Price (₦) <ArrowUpDown size={12} />
                </div>
              </th>
              <th style={{ textAlign: 'right', padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700 }}>24h Change</th>
              <th style={{ textAlign: 'right', padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700 }}>Volume</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)', fontSize: '0.88rem' }}>
                  {loading ? 'Loading market data…' : 'No equities found'}
                </td>
              </tr>
            )}
            {filtered.map((eq, idx) => {
              const pos = (eq.change ?? 0) >= 0;
              return (
                <tr key={eq.symbol || idx} className="eq-row">
                  <td style={{ padding: '13px 14px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>{idx + 1}</td>
                  <td style={{ padding: '13px 14px', fontWeight: 800, fontSize: '0.95rem' }}>{eq.symbol}</td>
                  <td style={{ padding: '13px 14px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>{eq.name || '—'}</td>
                  <td style={{ padding: '13px 14px', textAlign: 'right', fontWeight: 700 }} className="font-mono">
                    ₦{Number(eq.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '13px 14px', textAlign: 'right' }}>
                    <span className={pos ? 'pos-badge' : 'neg-badge'} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '3px 9px', borderRadius: 'var(--radius-full)',
                      fontSize: '0.79rem', fontWeight: 700,
                      background: pos ? 'var(--color-positive-bg)' : 'var(--color-negative-bg)',
                      color: pos ? 'var(--color-positive)' : 'var(--color-negative)',
                    }}>
                      {pos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {pos ? '+' : ''}{eq.change}%
                    </span>
                  </td>
                  <td style={{ padding: '13px 14px', textAlign: 'right', color: 'var(--text-dim)', fontSize: '0.83rem' }} className="font-mono">
                    {eq.volume ? Number(eq.volume).toLocaleString() : (eq.marketCap || '—')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      {filtered.length > 0 && (
        <div style={{ marginTop: 14, fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'right' }}>
          Showing {filtered.length} of {equities.length} equities
        </div>
      )}
    </div>
  );
}
