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
};

const StockChart = () => {
  const [ticker, setTicker] = useState("AAPL");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", { ticker });
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
      <div className="flex gap-4 mb-4">
        {/* Dropdown for selecting stock */}
        <select
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="border p-2 rounded-lg "
        >
          {Object.entries(stockOptions).map(([symbol, name]) => (
            <option key={symbol} value={symbol}>
              {name} ({symbol})
            </option>
          ))}
        </select>

        <button
          onClick={fetchPrediction}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          {loading ? "Loading..." : "Predict"}
        </button>
      </div>

      {data.length > 0 && (
        <ResponsiveContainer width="80%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 50, bottom: 40 }}>
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
              formatter={(value) => `$${value.toFixed(2)}`}
              labelFormatter={(label) => {
                const d = new Date(label);
                return `${d.getDate()} ${d.toLocaleString("default", { month: "short" })}`;
              }}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StockChart;
