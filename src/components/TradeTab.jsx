import React, { useState } from 'react';
import { ShoppingCart, ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { executeOrder, useAuth, useToast } from '../lib';

const SYMBOLS = ['DANGCEM','GTCO','ZENITHBANK','MTNN','AIRTELAFRI','BUACEMENT','SEPLAT','NESTLE','ACCESSCORP','UBA','FBNH','TRANSCORP'];

export default function TradeTab() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [action, setAction] = useState('BUY');
  const [symbol, setSymbol] = useState('DANGCEM');
  const [quantity, setQuantity] = useState(100);
  const [price, setPrice] = useState(650.00);
  const [loading, setLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const total = (Number(quantity) || 0) * (Number(price) || 0);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!symbol || quantity <= 0 || price <= 0) { showToast('Please enter valid order parameters.', 'error'); return; }
    setLoading(true);
    try {
      const r = await executeOrder(symbol, action, quantity, price, token);
      setLastOrder(r);
      showToast(`✅ Order ${r.order_id} — ${action} ${quantity} ${symbol} @ ₦${price}`, 'success');
    } catch (err) { showToast(err?.message || 'Order failed', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', width: '100%' }}>
      <div className="glass-panel" style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: action === 'BUY' ? 'var(--color-positive-bg)' : 'var(--color-negative-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRightLeft size={20} color={action === 'BUY' ? 'var(--color-positive)' : 'var(--color-negative)'} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Execute Trade Order</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Place instant order on Nigerian Stock Exchange</p>
          </div>
        </div>

        {/* BUY / SELL Toggle */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.35)', padding: 4, borderRadius: 'var(--radius-md)', margin: '22px 0', border: '1px solid var(--border-subtle)', gap: 4 }}>
          <button type="button" className={`action-tab${action === 'BUY' ? ' buy-active' : ''}`} onClick={() => { setAction('BUY'); setLastOrder(null); }}>BUY SHARES</button>
          <button type="button" className={`action-tab${action === 'SELL' ? ' sell-active' : ''}`} onClick={() => { setAction('SELL'); setLastOrder(null); }}>SELL SHARES</button>
        </div>

        <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Equity Symbol</label>
            <select className="input-field" value={symbol} onChange={e => setSymbol(e.target.value)}>
              {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Quantity (Shares)</label>
              <input className="input-field font-mono" type="number" min="1" step="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Price per Share (₦)</label>
              <input className="input-field font-mono" type="number" min="0.01" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            {[
              ['Action', <span style={{ color: action === 'BUY' ? 'var(--color-positive)' : 'var(--color-negative)', fontWeight: 700 }}>{action}</span>],
              ['Symbol', <strong>{symbol}</strong>],
              ['Quantity × Price', `${Number(quantity).toLocaleString()} × ₦${Number(price).toLocaleString()}`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.86rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 8, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700 }}>Total Order Value</span>
              <span className="font-mono text-gradient" style={{ fontSize: '1.55rem', fontWeight: 800 }}>
                ₦{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              padding: 16, fontSize: '0.97rem',
              background: action === 'BUY' ? 'var(--grad-positive)' : 'var(--grad-negative)',
              boxShadow: action === 'BUY' ? '0 4px 20px rgba(16,185,129,0.4)' : '0 4px 20px rgba(244,63,94,0.4)',
            }}
          >
            {loading
              ? <><span className="animate-spin" style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} /> Executing…</>
              : <><ShoppingCart size={18} /> Confirm {action} Order</>}
          </button>
        </form>

        {/* Order Confirmation */}
        {lastOrder && (
          <div className="fade-up" style={{ marginTop: 20, padding: 18, borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.35)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <CheckCircle2 size={20} color="var(--color-positive)" />
              <span style={{ fontWeight: 700, color: 'var(--color-positive)' }}>Order Confirmed — {lastOrder.status || 'FILLED'}</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              <div>Order ID: <strong className="font-mono" style={{ color: '#f8fafc' }}>{lastOrder.order_id}</strong></div>
              <div>Symbol: <strong>{lastOrder.symbol}</strong> · Action: <strong style={{ color: action === 'BUY' ? 'var(--color-positive)' : 'var(--color-negative)' }}>{lastOrder.action}</strong></div>
              <div>Qty: <strong>{lastOrder.quantity}</strong> · Price: <strong>₦{lastOrder.price}</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
