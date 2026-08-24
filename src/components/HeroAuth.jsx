import React, { useState } from 'react';
import { TrendingUp, ShieldCheck, Zap, Bot, ArrowRight, Lock, Mail, User, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export const HeroAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login, signup, loading } = useAuth();
  const { showToast } = useToast();

  const tickerItems = [
    { symbol: 'DANGCEM', change: '+2.45%', positive: true },
    { symbol: 'GTCO', change: '+1.88%', positive: true },
    { symbol: 'ZENITHBANK', change: '-0.94%', positive: false },
    { symbol: 'MTNN', change: '+3.52%', positive: true },
    { symbol: 'AIRTELAFRI', change: '+0.85%', positive: true },
    { symbol: 'BUACEMENT', change: '-1.36%', positive: false },
    { symbol: 'SEPLAT', change: '+4.55%', positive: true },
    { symbol: 'NESTLE', change: '+1.12%', positive: true },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!isLogin && !formData.fullName) newErrors.fullName = 'Full name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        showToast('Logged in successfully!', 'success');
      } else {
        await signup(formData.fullName, formData.email, formData.password);
        showToast('Account created successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Authentication failed', 'error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'stretch',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Left Hero Panel */}
      <div style={{
        flex: '1.2',
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        background: 'var(--grad-hero)',
        borderRight: '1px solid var(--border-subtle)'
      }}>
        {/* Floating gradient elements */}
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>

        {/* Top Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1 }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'var(--grad-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px var(--primary-glow)'
          }}>
            <TrendingUp size={28} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800 }} className="text-gradient">
              NGX Alpha Labs
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
              Nigerian Stock Exchange Intelligence
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div style={{ maxWidth: '580px', margin: '40px 0', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--primary-400)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '24px'
          }}>
            <Sparkles size={16} />
            <span>AI-Driven Stock Market Predictions</span>
          </div>

          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '20px'
          }}>
            Trade NGX Stocks with <span className="text-gradient">Machine Intelligence</span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '36px'
          }}>
            Real-time market surveillance, predictive AI analytics, and instant order execution tailored for the Nigerian Capital Market.
          </p>

          {/* Feature Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[
              { icon: Bot, label: 'ML Predictions', desc: 'Real-time Signals' },
              { icon: Zap, label: 'Fast Execution', desc: 'Instant Orders' },
              { icon: ShieldCheck, label: 'Bank Security', desc: 'Encrypted JWT' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <Icon size={22} style={{ color: 'var(--primary-400)', marginBottom: '8px' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ticker Marquee */}
        <div style={{
          zIndex: 1,
          overflow: 'hidden',
          background: 'rgba(13, 18, 36, 0.6)',
          backdropFilter: 'blur(12px)',
          padding: '12px 0',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div className="animate-marquee">
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px', whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.symbol}</span>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: item.positive ? 'var(--color-positive)' : 'var(--color-negative)',
                  background: item.positive ? 'var(--color-positive-bg)' : 'var(--color-negative-bg)',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div style={{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: 'var(--bg-deep)',
        zIndex: 1
      }}>
        <div className="glass-panel" style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px',
          borderRadius: 'var(--radius-lg)'
        }}>
          {/* Form Tabs */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '32px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: isLogin ? 'var(--grad-primary)' : 'transparent',
                color: isLogin ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: !isLogin ? 'var(--grad-primary)' : 'transparent',
                color: !isLogin ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Create Account
            </button>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {isLogin ? 'Sign in to access your NGX AI trading console' : 'Join NGX Alpha Labs for AI market analytics'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="input-field"
                    style={{ paddingLeft: '42px' }}
                  />
                </div>
                {errors.fullName && <span style={{ color: 'var(--color-negative)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>{errors.fullName}</span>}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
              {errors.email && <span style={{ color: 'var(--color-negative)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
              {errors.password && <span style={{ color: 'var(--color-negative)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>{errors.password}</span>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '8px', padding: '14px' }}>
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In to Console' : 'Create My Account'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
