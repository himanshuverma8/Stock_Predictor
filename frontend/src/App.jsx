import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StockChart from './components/StockChart.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <StockChart />
    </div>
    </>
  )
}

export default App
