# NGX Alpha Labs — FastAPI Backend API & ML Prediction Engine

This is the backend API and machine learning prediction service for **NGX Alpha Labs** (Nigerian Stock Exchange AI Trading Platform).

## Machine Learning Pipeline
The prediction engine is trained directly on the quantitative feature architecture developed in the research notebooks:
1. `notebooks/Equity_price_movement_predictor.ipynb`
2. `notebooks/stock_pred_group6updated.ipynb`

### Features (31 quantitative indicators + 30 NGX symbols):
- **10 Base Features:** `previous_close`, `ma_5`, `ma_20`, `rsi`, `volume`, `news_sentiment`, `interest_rate`, `inflation_rate`, `oil_price`, `usd_local_rate`
- **21 Engineered Indicators:**
  - *Adaptive Market Hypothesis:* `Trend_Strength`, `Momentum`, `Trend_Direction`, `Relative_RSI`
  - *Arbitrage Pricing Theory:* `Real_Interest_Rate`, `Oil_FX_Ratio`, `Economic_Stress`, `Import_Cost`
  - *Behavioural Finance:* `Sentiment_Impact`, `Buying_Pressure`, `Speculation_Index`
  - *Valuation Proxies:* `Price_Premium`, `Mean_Reversion`
  - *Market Liquidity & Volatility:* `Relative_Volume`, `Liquidity_Score`, `MA_Spread`, `Relative_Spread`, `RSI_Strength`
  - *NGX Macro Interactions:* `Oil_Revenue_Index`, `Naira_Strength`, `Oil_Inflation`
- **One-Hot Encoding:** 30 NGX tickers (`DANGCEM`, `GTCO`, `MTNN`, `SEPLAT`, `AIRTELAFRI`, `ACCESSCORP`, etc.)

### Winning Model:
- **ExtraTreesClassifier** (tuned with `n_estimators=535`, `max_depth=10`, `min_samples_split=6`, `min_samples_leaf=2`, `max_features='log2'`, `bootstrap=False`, `class_weight='balanced'`)
- Integrated with soft-voting ensemble (`ExtraTrees` + `XGBoost` + `LightGBM`)
- Achieves benchmark **ROC-AUC of 0.622** on the validation set.

---

## API Endpoints
- `GET /` - Root health check
- `GET /docs` - Swagger UI interactive API documentation
- `POST /api/signup` - User Registration
- `POST /api/login` - User Authentication
- `POST /auth/token` - OAuth2 JWT Token Login
- `GET /api/market-summary` - Intraday NGX market indices (ASI, market cap, turnover, volume)
- `POST /api/predict` - ML Stock Prediction Algorithm
- `GET /api/model/info` - Active ML model metadata and feature architecture
- `POST /api/order` - Trade Order Execution (BUY / SELL)
- `GET /api/v1/equities` - Protected Equities Listing (`Authorization: Bearer <token>`)

## Local Setup
```bash
cd backend
pip install -r requirements.txt
python ml_model.py          # Train / verify model
uvicorn main:app --reload --port 8000
```
Open `http://localhost:8000/docs` in your browser.
