from fastapi import FastAPI
import yfinance as yf
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.optimizers import Adam
from sklearn.preprocessing import MinMaxScaler
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (set to frontend URL in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class StockRequest(BaseModel):
    ticker: str

# Function to train LSTM and predict stock prices
def predict_stock(ticker):
    try:
        # Fetch last 1 year of stock data
        start_date = (datetime.today() - timedelta(days=365)).strftime('%Y-%m-%d')
        end_date = datetime.today().strftime('%Y-%m-%d')
        data = yf.download(ticker, start=start_date, end=end_date)

        if data.empty:
            return {"error": "Invalid ticker or no data available."}

        # Use only 'Close' prices
        data = data[['Close']]
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(data)

        # Prepare dataset
        def create_dataset(data, time_step=60):
            X, y = [], []
            for i in range(len(data) - time_step - 1):
                X.append(data[i:(i + time_step), 0])
                y.append(data[i + time_step, 0])
            return np.array(X), np.array(y)

        time_step = 60
        X, y = create_dataset(scaled_data, time_step)
        X = X.reshape(X.shape[0], X.shape[1], 1)

        # Build LSTM Model
        model = Sequential([
            LSTM(50, return_sequences=True, input_shape=(X.shape[1], 1)),
            LSTM(50, return_sequences=False),
            Dense(1)
        ])
        model.compile(optimizer=Adam(learning_rate=0.001), loss='mean_squared_error')

        # Train model
        model.fit(X, y, epochs=5, batch_size=32, verbose=0)

        # Predict next 30 days
        last_60_days = scaled_data[-time_step:].reshape(1, -1, 1)
        predicted_prices = []
        for _ in range(30):
            predicted_price = model.predict(last_60_days)
            predicted_prices.append(predicted_price[0][0])
            last_60_days = np.append(last_60_days[:, 1:, :], predicted_price.reshape(1, 1, 1), axis=1)

        predicted_prices = scaler.inverse_transform(np.array(predicted_prices).reshape(-1, 1))
        predicted_dates = pd.date_range(datetime.today(), periods=30).strftime('%Y-%m-%d').tolist()

        return {"dates": predicted_dates, "prices": predicted_prices.flatten().tolist()}

    except Exception as e:
        return {"error": str(e)}

@app.post("/predict")
def get_prediction(stock: StockRequest):
    return predict_stock(stock.ticker)

