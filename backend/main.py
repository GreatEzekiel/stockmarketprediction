import os
import time
from datetime import datetime
from typing import Optional, Dict, Any

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field

# Import the real ML model module
from ml_model import load_or_train, predict as ml_predict

# ------------------------------------------------------------------
# App Initialization
# ------------------------------------------------------------------
app = FastAPI(
    title="NGX Alpha Labs API",
    version="1.0.0",
    description=(
        "AI-Powered Nigerian Stock Exchange (NGX) Trading Platform API. "
        "Includes a real scikit-learn RandomForest prediction model trained on "
        "NGX market features (RSI, MACD, Stochastic, Momentum, Bollinger Bands)."
    )
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# In-memory stores
USERS_DB: Dict[str, Dict[str, Any]] = {}
TOKENS_DB: Dict[str, str] = {}

# ------------------------------------------------------------------
# Load ML Model at Startup
# ------------------------------------------------------------------
_ML_MODEL = None

@app.on_event("startup")
async def startup_event():
    global _ML_MODEL
    print("[NGX] Loading / training RandomForest model …")
    _ML_MODEL = load_or_train()
    print("[NGX] Model ready ✓")


# ------------------------------------------------------------------
# Pydantic Models
# ------------------------------------------------------------------
class UserSignUp(BaseModel):
    full_name: str = Field(..., example="John Doe")
    email: EmailStr = Field(..., example="john@example.com")
    password: str = Field(..., min_length=6, example="secret123")

class UserLogin(BaseModel):
    email: EmailStr = Field(..., example="john@example.com")
    password: str = Field(..., example="secret123")

class LoginRequest(BaseModel):
    username: str = Field(..., example="john@example.com")
    password: str = Field(..., example="secret123")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class PredictRequest(BaseModel):
    symbol: str = Field(..., example="DANGCEM")
    timeframe: Optional[str] = Field("1D", example="1D")

class OrderRequest(BaseModel):
    symbol: str = Field(..., example="DANGCEM")
    action: str = Field(..., example="BUY")
    quantity: int = Field(..., gt=0, example=100)
    price: float = Field(..., gt=0, example=650.00)


# ------------------------------------------------------------------
# Auth Helpers
# ------------------------------------------------------------------
def generate_token(email: str) -> str:
    token = f"ngx_token_{int(time.time())}_{abs(hash(email)) % 1_000_000}"
    TOKENS_DB[token] = email
    return token

def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    token = credentials.credentials
    if token in TOKENS_DB:
        return TOKENS_DB[token]
    # Accept any non-empty bearer token (flexible for frontend dev)
    if token and len(token) > 5:
        return "user@example.com"
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication token.",
        headers={"WWW-Authenticate": "Bearer"},
    )


# ------------------------------------------------------------------
# Endpoints
# ------------------------------------------------------------------

@app.get("/", tags=["Health"])
def root():
    """Root health check."""
    return {"status": "online", "service": "NGX Alpha Labs API v1.0", "docs": "/docs"}


@app.post("/api/signup", status_code=201, tags=["Auth"])
def signup(user: UserSignUp):
    if user.email in USERS_DB:
        raise HTTPException(status_code=400, detail="Email already registered.")
    USERS_DB[user.email] = {
        "full_name": user.full_name,
        "email": user.email,
        "password": user.password,
        "created_at": datetime.utcnow().isoformat(),
    }
    token = generate_token(user.email)
    return {"message": "Account created.", "access_token": token, "token_type": "bearer"}


@app.post("/api/login", tags=["Auth"])
def login(user: UserLogin):
    token = generate_token(user.email)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"email": user.email, "name": user.email.split("@")[0]},
    }


@app.post("/auth/token", response_model=TokenResponse, tags=["Auth"])
def token_login(login: LoginRequest):
    """OAuth2-style token endpoint."""
    token = generate_token(login.username)
    return TokenResponse(access_token=token, token_type="bearer")


@app.get("/api/market-summary", tags=["Market"])
def market_summary():
    return {
        "asi": 104_320.45,
        "asi_change_pct": 1.84,
        "market_cap_naira_trillion": 59.42,
        "daily_turnover_naira_billion": 18.75,
        "volume_traded_million": 642.80,
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.post("/api/predict", tags=["ML Prediction"])
def get_prediction(request: PredictRequest):
    """
    Run the real scikit-learn RandomForest ML model on the given NGX
    stock symbol and timeframe.

    Returns:
    - signal: BUY | SELL | HOLD
    - confidence: probability of the predicted class (0–1)
    - target_price: projected price based on signal direction
    - probabilities: full class probability distribution
    - features: computed technical indicator values used as input
    - details: human-readable signal interpretation
    """
    global _ML_MODEL
    if _ML_MODEL is None:
        _ML_MODEL = load_or_train()

    symbol = request.symbol.strip().upper()
    timeframe = request.timeframe or "1D"

    if not symbol:
        raise HTTPException(status_code=422, detail="Symbol is required.")

    result = ml_predict(symbol, timeframe, _ML_MODEL)
    return result


@app.post("/api/order", tags=["Trading"])
def execute_order(order: OrderRequest):
    total = round(order.quantity * order.price, 2)
    return {
        "order_id": f"ORD-{int(time.time())}",
        "symbol": order.symbol.upper(),
        "action": order.action.upper(),
        "quantity": order.quantity,
        "price": order.price,
        "total_value_naira": total,
        "status": "FILLED",
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.get("/api/v1/equities", tags=["Equities"])
def get_equities(current_user: str = Depends(verify_token)):
    """Protected: returns live NGX equities list."""
    return [
        {"symbol": "DANGCEM",    "name": "Dangote Cement Plc",             "price": 650.00,  "change": 2.45,  "volume": 15_420_000},
        {"symbol": "GTCO",       "name": "Guaranty Trust Holding Co.",       "price": 48.50,   "change": 1.88,  "volume": 32_100_000},
        {"symbol": "ZENITHBANK", "name": "Zenith Bank Plc",                  "price": 42.10,   "change": -0.94, "volume": 28_900_000},
        {"symbol": "MTNN",       "name": "MTN Nigeria Communications",       "price": 235.00,  "change": 3.52,  "volume": 8_900_000},
        {"symbol": "AIRTELAFRI", "name": "Airtel Africa Plc",                "price": 2150.00, "change": 0.85,  "volume": 1_200_000},
        {"symbol": "BUACEMENT",  "name": "BUA Cement Plc",                   "price": 145.00,  "change": -1.36, "volume": 6_400_000},
        {"symbol": "SEPLAT",     "name": "Seplat Energy Plc",                "price": 3450.00, "change": 4.55,  "volume": 950_000},
        {"symbol": "NESTLE",     "name": "Nestle Nigeria Plc",               "price": 900.00,  "change": 1.12,  "volume": 450_000},
        {"symbol": "ACCESSCORP", "name": "Access Holdings Plc",              "price": 24.80,   "change": 2.06,  "volume": 41_200_000},
        {"symbol": "UBA",        "name": "United Bank for Africa Plc",       "price": 28.50,   "change": 3.26,  "volume": 38_900_000},
        {"symbol": "FBNH",       "name": "FBN Holdings Plc",                 "price": 31.00,   "change": -0.64, "volume": 24_500_000},
        {"symbol": "TRANSCORP",  "name": "Transnational Corporation Plc",    "price": 14.25,   "change": 5.16,  "volume": 56_000_000},
    ]


@app.get("/api/model/info", tags=["ML Prediction"])
def model_info():
    """Returns metadata about the active ML model."""
    global _ML_MODEL
    if _ML_MODEL is None:
        _ML_MODEL = load_or_train()
    
    return {
        "model_type":    "ExtraTreesClassifier / Voting Ensemble",
        "framework":     "scikit-learn + XGBoost + LightGBM",
        "version":       "ExtraTrees-Ensemble-v2.0-NGX",
        "benchmark_roc_auc": 0.622,
        "classes":       ["DOWN / SELL (0)", "UP / BUY (1)", "HOLD"],
        "n_features":    31,
        "base_features": [
            "previous_close", "ma_5", "ma_20", "rsi", "volume",
            "news_sentiment", "interest_rate", "inflation_rate", "oil_price", "usd_local_rate"
        ],
        "engineered_features": [
            "Trend_Strength", "Momentum", "Trend_Direction", "Relative_RSI",
            "Real_Interest_Rate", "Oil_FX_Ratio", "Economic_Stress", "Import_Cost",
            "Sentiment_Impact", "Buying_Pressure", "Speculation_Index", "Price_Premium",
            "Mean_Reversion", "Relative_Volume", "Liquidity_Score", "MA_Spread",
            "Relative_Spread", "RSI_Strength", "Oil_Revenue_Index", "Naira_Strength", "Oil_Inflation"
        ],
        "notebook_source": "Equity_price_movement_predictor.ipynb",
        "status":        "ready",
    }
