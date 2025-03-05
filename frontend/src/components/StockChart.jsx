import React, { useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

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
      <h2 className="text-2xl font-semibold mb-4">Stock Price Prediction</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Enter Stock Ticker (e.g., AAPL)"
          className="border p-2 rounded-lg text-black"
        />
        <button
          onClick={fetchPrediction}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          {loading ? "Loading..." : "Predict"}
        </button>
      </div>

      {data.length > 0 && (
        <ResponsiveContainer width="90%" height={400}>
          <LineChart data={data}>
            <XAxis dataKey="date" tick={{ fill: "white" }} />
            <YAxis tick={{ fill: "white" }} />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StockChart;
