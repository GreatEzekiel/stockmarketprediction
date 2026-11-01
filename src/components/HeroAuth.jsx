import React, { useState } from 'react';
import { TrendingUp, ShieldCheck, Zap, Bot, ArrowRight, Mail, KeyRound, User, Sparkles } from 'lucide-react';
import { useAuth, useToast } from '../lib';

const TICKER = [
  { s: 'DANGCEM', c: '+2.45%', up: true }, { s: 'GTCO', c: '+1.88%', up: true },
  { s: 'ZENITHBANK', c: '-0.94%', up: false }, { s: 'MTNN', c: '+3.52%', up: true },
  { s: 'AIRTELAFRI', c: '+0.85%', up: true }, { s: 'SEPLAT', c: '+4.55%', up: true },
  { s: 'BUACEMENT', c: '-1.36%', up: false }, { s: 'UBA', c: '+3.26%', up: true },
];

function TickerItem({ s, c, up }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px', userSelect: 'none' }}>
      <span style={{ fontWeight: 700, fontSize: '0.83rem', color: '#f8fafc' }}>{s}</span>
      <span style={{
        fontSize: '0.78rem', fontWeight: 700,
        padding: '2px 8px', borderRadius: 4,
        background: up ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
        color: up ? '#10b981' : '#f43f5e'
      }}>{c}</span>
      <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.7rem' }}>•</span>
    </div>
  );
}

export default function HeroAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login, signup, loading } = useAuth();
  const { showToast } = useToast();

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    if (!isLogin && !form.fullName) e.fullName = 'Full name is required';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      if (isLogin) { await login(form.email, form.password); showToast('Welcome back!', 'success'); }
      else { await signup(form.fullName, form.email, form.password); showToast('Account created! Welcome.', 'success'); }
    } catch (err) {
      showToast(err?.message || 'Authentication failed. Please try again.', 'error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* LEFT HERO PANEL */}
      <div className="hero-left" style={{
        flex: 1.2, padding: '48px 56px', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', background: 'var(--grad-hero)',
        borderRight: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden',
      }}>
        {/* Orbs inside hero */}
        <div style={{ position: 'absolute', top: -60, left: -60, width: 400, height: 400, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -40, width: 350, height: 350, borderRadius: '50%', background: 'rgba(6,182,212,0.12)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px var(--primary-glow)' }}>
            <TrendingUp size={28} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em' }} className="text-gradient">NGX Alpha Labs</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nigerian Stock Exchange Intelligence</div>
          </div>
        </div>

        {/* Hero Content */}
        <div style={{ maxWidth: 540, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(99,102,241,0.12)', border: '1px solid var(--border-glow)', borderRadius: 'var(--radius-full)', color: 'var(--primary-400)', fontSize: '0.82rem', fontWeight: 600, marginBottom: 20 }}>
            <Sparkles size={15} />
            <span>AI-Powered NGX Market Intelligence</span>
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 18, color: '#f8fafc' }}>
            Trade Smarter with <span className="text-gradient">Machine Learning</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 32 }}>
            Real-time AI stock predictions, instant order execution, and live market data for the Nigerian Capital Market.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
              { icon: Bot, label: 'ML Predictions', desc: 'Real-time Signals' },
              { icon: Zap, label: 'Instant Orders', desc: 'BUY / SELL Fast' },
              { icon: ShieldCheck, label: 'Secure Auth', desc: 'JWT Protected' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="glass-panel" style={{ padding: '16px 14px', borderRadius: 'var(--radius-md)' }}>
                <Icon size={20} style={{ color: 'var(--primary-400)', marginBottom: 8 }} />
                <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticker */}
        <div style={{ overflow: 'hidden', background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '10px 0', position: 'relative', zIndex: 1 }}>
          <div className="animate-marquee">
            {[...TICKER, ...TICKER].map((t, i) => <TickerItem key={i} {...t} />)}
          </div>
        </div>
      </div>

      {/* RIGHT AUTH PANEL */}
      <div className="hero-right" style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px', background: 'var(--bg-deep)',
      }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: 420, padding: '36px 32px' }}>

          {/* Auth Tabs */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: 4, borderRadius: 'var(--radius-md)', marginBottom: 28, border: '1px solid var(--border-subtle)', gap: 4 }}>
            <button type="button" className={`auth-tab${isLogin ? ' active' : ''}`} onClick={() => { setIsLogin(true); setErrors({}); }}>
              Sign In
            </button>
            <button type="button" className={`auth-tab${!isLogin ? ' active' : ''}`} onClick={() => { setIsLogin(false); setErrors({}); }}>
              Create Account
            </button>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 26 }}>
            <h2 style={{ fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {isLogin ? 'Sign in to your NGX Alpha Labs trading console.' : 'Join NGX Alpha Labs for AI market analytics.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
                  <input className="input-field" type="text" placeholder="John Doe" value={form.fullName} onChange={set('fullName')} style={{ paddingLeft: 42 }} />
                </div>
                {errors.fullName && <span className="field-error">{errors.fullName}</span>}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
                <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} style={{ paddingLeft: 42 }} />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
                <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} style={{ paddingLeft: 42 }} />
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: 4, fontSize: '0.95rem' }}>
              {loading
                ? <><span className="animate-spin" style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} /> Processing…</>
                : <>{isLogin ? 'Sign In to Console' : 'Create My Account'} <ArrowRight size={18} /></>}
            </button>
          </form>

          <p style={{ marginTop: 20, textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setIsLogin(!isLogin); setErrors({}); }} style={{ background: 'none', border: 'none', color: 'var(--primary-400)', fontWeight: 700, cursor: 'pointer', fontSize: 'inherit' }}>
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
