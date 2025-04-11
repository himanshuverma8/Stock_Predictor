import { useState } from 'react'
import StockChart from './components/StockChart.jsx'
import Navbar from './components/Navbar.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="main-container min-h-screen" data-theme="black">
      <Navbar />
      <StockChart />
      </div>
    </>
  )
}

export default App
