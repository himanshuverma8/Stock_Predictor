import StockChart from './components/StockChart.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <>
      <div className="main-container min-h-screen" data-theme="black">
      <Navbar />
      <StockChart />
      <Footer />
      </div>
    </>
  )
}

export default App
