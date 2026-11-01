import React, { useState } from 'react';
import { TrendingUp, BarChart2, Cpu, ArrowRightLeft, ListFilter, LogOut, User, Clock } from 'lucide-react';
import { useAuth } from '../lib';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'predict', label: 'AI Predict', icon: Cpu },
  { id: 'trade',   label: 'Trade',     icon: ArrowRightLeft },
  { id: 'equities',label: 'Equities',  icon: ListFilter },
];

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const [time, setTime] = React.useState(() => new Date().toLocaleTimeString('en-GB', { hour12: false }));

  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('en-GB', { hour12: false })), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="glass-panel" style={{
      margin: '16px 20px 0',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      position: 'sticky',
      top: 16,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: 'var(--grad-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px var(--primary-glow)'
        }}>
          <TrendingUp size={22} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }} className="text-gradient">
            NGX Alpha Labs
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            AI Trading Platform
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <nav style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: 'rgba(0,0,0,0.35)', padding: 5,
        borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
      }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-tab${activeTab === id ? ' active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={16} />
            <span className="nav-label">{label}</span>
          </button>
        ))}
      </nav>

      {/* Clock + User + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
          <span className="animate-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          <Clock size={13} style={{ color: 'var(--text-dim)' }} />
          <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{time}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px', background: 'rgba(99,102,241,0.1)', border: '1px solid var(--border-glow)', borderRadius: 'var(--radius-md)' }}>
          <User size={14} style={{ color: 'var(--primary-400)' }} />
          <span style={{ fontSize: '0.83rem', fontWeight: 700 }}>{user?.name || 'Trader'}</span>
        </div>
        <button
          onClick={logout}
          title="Sign Out"
          style={{
            background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)',
            color: 'var(--color-negative)', padding: '8px 12px',
            borderRadius: 'var(--radius-md)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
            fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,63,94,0.1)'}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
