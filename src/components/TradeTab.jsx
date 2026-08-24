import React, { useState } from 'react';
import { ArrowRightLeft, DollarSign, CheckCircle2, ShieldCheck, ShoppingCart, Tag } from 'lucide-react';
import { executeOrder } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export const TradeTab = () => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [action, setAction] = useState('BUY');
  const [symbol, setSymbol] = useState('DANGCEM');
  const [quantity, setQuantity] = useState(100);
  const [price, setPrice] = useState(650.00);
  const [loading, setLoading] = useState(false);

  const symbolsList = ['DANGCEM', 'GTCO', 'ZENITHBANK', 'MTNN', 'AIRTELAFRI', 'BUACEMENT', 'SEPLAT', 'NESTLE', 'ACCESSCORP', 'UBA'];

  const total = Number(quantity || 0) * Number(price || 0);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!symbol || quantity <= 0 || price <= 0) {
      showToast('Please enter valid order parameters', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await executeOrder(symbol, action, quantity, price, token);
      showToast(`Order executed: ${action} ${quantity} shares of ${symbol} @ ₦${price}`, 'success');
    } catch (err) {
      showToast(err.message || 'Order placement failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: action === 'BUY' ? 'var(--color-positive-bg)' : 'var(--color-negative-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: action === 'BUY' ? 'var(--color-positive)' : 'var(--color-negative)'
          }}>
            <ArrowRightLeft size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Execute Trade Order</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Place instant order on Nigerian Stock Exchange</p>
          </div>
        </div>

        {/* Action BUY / SELL Toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          margin: '24px 0',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            type="button"
            onClick={() => setAction('BUY')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: action === 'BUY' ? 'var(--grad-positive)' : 'transparent',
              color: '#ffffff',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.2s ease'
            }}
          >
            BUY SHARES
          </button>
          <button
            type="button"
            onClick={() => setAction('SELL')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: action === 'SELL' ? 'var(--grad-negative)' : 'transparent',
              color: '#ffffff',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.2s ease'
            }}
          >
            SELL SHARES
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Equity Symbol
            </label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="input-field"
            >
              {symbolsList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Quantity (Shares)
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input-field font-mono"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Order Price (₦)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input-field font-mono"
              />
            </div>
          </div>

          {/* Live Calculation Summary */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginTop: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <span>Action</span>
              <strong style={{ color: action === 'BUY' ? 'var(--color-positive)' : 'var(--color-negative)' }}>{action}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <span>Quantity × Price</span>
              <span>{Number(quantity).toLocaleString()} × ₦{Number(price).toLocaleString()}</span>
            </div>
            <div style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-subtle)',
              marginTop: '8px'
            }}>
              <span style={{ fontWeight: 700 }}>Total Order Value</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800 }} className="font-mono text-gradient">
                ₦{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              padding: '16px',
              fontSize: '1rem',
              background: action === 'BUY' ? 'var(--grad-positive)' : 'var(--grad-negative)',
              boxShadow: action === 'BUY' ? '0 4px 20px rgba(16, 185, 129, 0.4)' : '0 4px 20px rgba(244, 63, 94, 0.4)'
            }}
          >
            <ShoppingCart size={20} />
            <span>{loading ? 'Executing Order...' : `Confirm ${action} Order`}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
