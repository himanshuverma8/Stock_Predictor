import React, { useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const stockOptions = {
  AAPL: "Apple Inc.",
  MSFT: "Microsoft Corp.",
  GOOGL: "Alphabet Inc.",
  AMZN: "Amazon.com Inc.",
  TSLA: "Tesla Inc.",
  META: "Meta Platforms Inc.",
  NFLX: "Netflix Inc.",
  NVDA: "NVIDIA Corp.",
  JPM: "JPMorgan Chase & Co.",
  V: "Visa Inc.",
  BAC: "Bank of America Corp.",
  WMT: "Walmart Inc.",
  DIS: "Walt Disney Co.",
  PEP: "PepsiCo Inc.",
  KO: "Coca-Cola Co.",
  MA: "Mastercard Inc.",
  UNH: "UnitedHealth Group Inc.",
  HD: "Home Depot Inc.",
  PG: "Procter & Gamble Co.",
  INTC: "Intel Corp.",
  MRK: "Merck & Co. Inc.",
  ORCL: "Oracle Corp.",
  ADBE: "Adobe Inc.",
  T: "AT&T Inc.",
  CRM: "Salesforce Inc.",
  NKE: "Nike Inc.",
  XOM: "Exxon Mobil Corp.",
  CVX: "Chevron Corp.",
  ABBV: "AbbVie Inc.",
  AVGO: "Broadcom Inc.",
  QCOM: "Qualcomm Inc.",
  AMD: "Advanced Micro Devices Inc.",
  COST: "Costco Wholesale Corp.",
  MCD: "McDonald's Corp.",
  PYPL: "PayPal Holdings Inc.",
  AMAT: "Applied Materials Inc.",
  LIN: "Linde plc",
  IBM: "International Business Machines Corp.",
  HON: "Honeywell International Inc.",
  SBUX: "Starbucks Corp.",
  GS: "Goldman Sachs Group Inc.",
  LLY: "Eli Lilly and Co.",
  DHR: "Danaher Corp.",
  TXN: "Texas Instruments Inc.",
  UPS: "United Parcel Service Inc.",
  CAT: "Caterpillar Inc.",
  BKNG: "Booking Holdings Inc.",
  BLK: "BlackRock Inc.",
  BA: "Boeing Co.",
  GE: "General Electric Co.",
  RTX: "RTX Corp. (Raytheon Technologies)",
  C: "Citigroup Inc.",
  F: "Ford Motor Co.",
  GM: "General Motors Co.",
  PLD: "Prologis Inc.",
  TMO: "Thermo Fisher Scientific Inc.",
};


const StockChart = () => {
  const [ticker, setTicker] = useState("AAPL");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://stock-predictor-wf3z.onrender.com/predict", { ticker });
      const { dates, prices } = response.data;
      const formattedData = dates.map((date, index) => ({
        date,
        price: prices[index],
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className="flex gap-4 mb-4 flex-wrap justify-center">
        <div className="flex flex-col items-center justify-center">
          <input
            list="stocks"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            className="border p-2 rounded-lg"
            placeholder="Enter or select ticker (e.g., AAPL)"
          />
          <datalist id="stocks">
            {Object.entries(stockOptions).map(([symbol, name]) => (
              <option key={symbol} value={symbol}>
                {name}
              </option>
            ))}
          </datalist>
        </div>

        <button
          onClick={fetchPrediction}
          className="btn bg-[#1A77F2] text-white border-[#005fd8] rounded-xl p-4"
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Predict"
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-100">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      ) : data.length > 0 && (
        <ResponsiveContainer width="80%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 50, bottom: 40 }}
          >
            <XAxis
              dataKey="date"
              tick={{ fill: "white" }}
              tickFormatter={(date) => {
                const d = new Date(date);
                return `${d.getDate()} ${d.toLocaleString("default", { month: "short" })}`;
              }}
              label={{
                value: "Date (DD-MMM)",
                position: "insideBottom",
                offset: -20,
                fill: "white",
                style: {
                  textAnchor: "middle",
                  fontWeight: "bold",
                },
              }}
            />
            <YAxis
              tick={{ fill: "white" }}
              tickFormatter={(price) => `$${price.toFixed(2)}`}
              label={{
                value: "Price ($)",
                angle: -90,
                position: "insideLeft",
                offset: -40,
                fill: "white",
                style: {
                  textAnchor: "middle",
                  fontWeight: "bold",
                },
              }}
            />
            <Tooltip
  content={({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const formattedDate = `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`;
      return (
        <div className="bg-white p-2 rounded shadow-md">
          <p style={{ color: "#1A77F2", fontWeight: "bold" }}>{formattedDate}</p>
          <p style={{ color: "#000" }}>
            Price: <span style={{ fontWeight: "bold" }}>${payload[0].value.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  }}
/>
            <CartesianGrid strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StockChart;
