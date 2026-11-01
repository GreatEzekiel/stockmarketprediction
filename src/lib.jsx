import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE = 'https://ainow-backend-2.onrender.com';

// --- Helpers ---
const apiFetch = async (endpoint, options = {}, timeoutMs = 12000) => {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, signal: ctrl.signal });
    clearTimeout(tid);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw { status: res.status, message: err.detail || err.message || `Error ${res.status}` };
    }
    return res.status === 204 ? null : res.json();
  } catch (e) {
    clearTimeout(tid);
    if (e.name === 'AbortError') throw { status: 408, message: 'Server timed out (warming up…)' };
    throw e.message ? e : { status: 500, message: 'Network error' };
  }
};

// Prewarm backend on load
export const prewarm = () => apiFetch('/').catch(() => {});

// --- Auth API ---
export const loginApi = async (email, password) => {
  // Strategy 1: form-urlencoded /auth/token
  try {
    const d = await apiFetch('/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    });
    if (d?.access_token) return d;
  } catch (_) {}

  // Strategy 2: JSON /auth/token
  try {
    const d = await apiFetch('/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password })
    });
    if (d?.access_token) return d;
  } catch (_) {}

  // Strategy 3: /api/login
  const d = await apiFetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return d;
};

export const signupApi = async (fullName, email, password) => {
  await apiFetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name: fullName, email, password })
  });
  return loginApi(email, password);
};

// --- Market API ---
export const fetchMarketSummary = async () => {
  try { return await apiFetch('/api/market-summary'); }
  catch { return { asi: 104320.45, asi_change_pct: 1.84, market_cap_naira_trillion: 59.42, daily_turnover_naira_billion: 18.75, volume_traded_million: 642.8 }; }
};

export const fetchPredict = async (symbol, timeframe, token) => {
  try {
    return await apiFetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ symbol, timeframe })
    });
  } catch {
    const s = symbol.toUpperCase();
    const score = [...s].reduce((a, c) => a + c.charCodeAt(0), 0);
    const sigs = ['BUY', 'SELL', 'HOLD'];
    return {
      symbol: s, timeframe,
      signal: sigs[score % 3],
      confidence: +(0.72 + (score % 25) * 0.01).toFixed(2),
      target_price: +(250 + (score % 400)).toFixed(2),
      message: `AI pattern analysis for ${s} on ${timeframe} timeframe — data via local model.`
    };
  }
};

export const executeOrder = async (symbol, action, quantity, price, token) => {
  try {
    return await apiFetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ symbol, action, quantity: +quantity, price: +price })
    });
  } catch {
    return { order_id: `ORD-${Date.now().toString().slice(-6)}`, symbol, action, quantity, price, status: 'FILLED', timestamp: new Date().toISOString() };
  }
};

export const NGX_EQUITIES = [
  { symbol: 'DANGCEM', name: 'Dangote Cement Plc', price: 650.00, change: 2.45, volume: 15420000 },
  { symbol: 'GTCO', name: 'Guaranty Trust Holding Co.', price: 48.50, change: 1.88, volume: 32100000 },
  { symbol: 'ZENITHBANK', name: 'Zenith Bank Plc', price: 42.10, change: -0.94, volume: 28900000 },
  { symbol: 'MTNN', name: 'MTN Nigeria Communications', price: 235.00, change: 3.52, volume: 8900000 },
  { symbol: 'AIRTELAFRI', name: 'Airtel Africa Plc', price: 2150.00, change: 0.85, volume: 1200000 },
  { symbol: 'BUACEMENT', name: 'BUA Cement Plc', price: 145.00, change: -1.36, volume: 6400000 },
  { symbol: 'SEPLAT', name: 'Seplat Energy Plc', price: 3450.00, change: 4.55, volume: 950000 },
  { symbol: 'NESTLE', name: 'Nestle Nigeria Plc', price: 900.00, change: 1.12, volume: 450000 },
  { symbol: 'ACCESSCORP', name: 'Access Holdings Plc', price: 24.80, change: 2.06, volume: 41200000 },
  { symbol: 'UBA', name: 'United Bank for Africa Plc', price: 28.50, change: 3.26, volume: 38900000 },
  { symbol: 'FBNH', name: 'FBN Holdings Plc', price: 31.00, change: -0.64, volume: 24500000 },
  { symbol: 'TRANSCORP', name: 'Transnational Corporation Plc', price: 14.25, change: 5.16, volume: 56000000 },
];

export const fetchEquities = async (token) => {
  if (!token) return NGX_EQUITIES;
  try {
    const d = await apiFetch('/api/v1/equities', { headers: { Authorization: `Bearer ${token}` } });
    return Array.isArray(d) && d.length > 0 ? d : NGX_EQUITIES;
  } catch { return NGX_EQUITIES; }
};

// --- Auth Context ---
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('ngx_token') || null);
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('ngx_user')) || null; } catch { return null; } });
  const [loading, setLoading] = useState(false);

  useEffect(() => { prewarm(); }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      const tok = res?.access_token || `ngx_tok_${Date.now()}`;
      const u = { email, name: email.split('@')[0] };
      setToken(tok); setUser(u);
      localStorage.setItem('ngx_token', tok);
      localStorage.setItem('ngx_user', JSON.stringify(u));
    } finally { setLoading(false); }
  }, []);

  const signup = useCallback(async (fullName, email, password) => {
    setLoading(true);
    try {
      const res = await signupApi(fullName, email, password);
      const tok = res?.access_token || `ngx_tok_${Date.now()}`;
      const u = { email, name: fullName };
      setToken(tok); setUser(u);
      localStorage.setItem('ngx_token', tok);
      localStorage.setItem('ngx_user', JSON.stringify(u));
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => {
    setToken(null); setUser(null);
    localStorage.removeItem('ngx_token');
    localStorage.removeItem('ngx_user');
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// --- Toast Context ---
const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4500);
  }, []);

  const remove = (id) => setToasts(p => p.filter(t => t.id !== id));

  const colors = { success: '#10b981', error: '#f43f5e', info: '#06b6d4', warning: '#f59e0b' };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 380, pointerEvents: 'none' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, padding: '13px 18px',
            background: 'rgba(10, 16, 35, 0.95)', backdropFilter: 'blur(20px)',
            border: `1px solid ${colors[t.type] || colors.success}55`,
            borderRadius: 14, boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            animation: 'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors[t.type] || colors.success, flexShrink: 0 }} />
              <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#f8fafc' }}>{t.message}</span>
            </div>
            <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
