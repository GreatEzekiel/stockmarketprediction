# NGX Alpha Labs — FastAPI Backend API

This is the backend API service for **NGX Alpha Labs** (Nigerian Stock Exchange AI Trading Platform).

## Endpoints
- `GET /` - Root health check
- `GET /docs` - Swagger UI interactive API documentation
- `POST /api/signup` - User Registration
- `POST /api/login` - User Authentication
- `POST /auth/token` - OAuth2 JWT Token Login
- `GET /api/market-summary` - Intraday NGX market indices (ASI, market cap, turnover, volume)
- `POST /api/predict` - ML Stock Prediction Algorithm
- `POST /api/order` - Trade Order Execution (BUY / SELL)
- `GET /api/v1/equities` - Protected Equities Listing (`Authorization: Bearer <token>`)

## Local Setup
```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Open `http://localhost:8000/docs` in your browser.
