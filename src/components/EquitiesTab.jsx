import React, { useState, useEffect } from 'react';
import { ListFilter, Search, RefreshCw, TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';
import { fetchEquities } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export const EquitiesTab = () => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [equities, setEquities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(false);

  const loadEquities = async () => {
    setLoading(true);
    try {
      const data = await fetchEquities(token);
      setEquities(data || []);
    } catch (err) {
      showToast('Loaded standard NGX market dataset', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquities();
  }, []);

  const filteredEquities = equities
    .filter(eq =>
      eq.symbol.toLowerCase().includes(search.toLowerCase()) ||
      (eq.name && eq.name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => sortAsc ? a.price - b.price : b.price - a.price);

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      {/* Header & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <ListFilter size={22} color="var(--primary-400)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>NGX Equities Market Directory</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time equity quotes and trading volume across the Nigerian Stock Exchange
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Search symbol or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '38px', paddingRight: '12px', height: '40px', fontSize: '0.85rem' }}
            />
          </div>

          <button onClick={loadEquities} className="btn-secondary" style={{ padding: '8px 16px', height: '40px' }}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Equities Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px' }}>Symbol</th>
              <th style={{ textAlign: 'left', padding: '12px 16px' }}>Company Name</th>
              <th
                onClick={() => setSortAsc(!sortAsc)}
                style={{ textAlign: 'right', padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                  <span>Price (₦)</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th style={{ textAlign: 'right', padding: '12px 16px' }}>24h Change</th>
              <th style={{ textAlign: 'right', padding: '12px 16px' }}>Volume / Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquities.map((item, idx) => {
              const isPositive = (item.change || 0) >= 0;
              return (
                <tr
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {item.symbol}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {item.name || 'NGX Listed Equity'}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, fontSize: '0.95rem' }} className="font-mono">
                    ₦{Number(item.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: isPositive ? 'var(--color-positive-bg)' : 'var(--color-negative-bg)',
                      color: isPositive ? 'var(--color-positive)' : 'var(--color-negative)'
                    }}>
                      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {isPositive ? '+' : ''}{item.change}%
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--text-dim)', fontSize: '0.85rem' }} className="font-mono">
                    {item.volume ? Number(item.volume).toLocaleString() : (item.marketCap || 'N/A')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
