import './App.css'
import Navbar from './components/Navbar/Navbar'
import Dashboard from './pages/dashboard/Dashboard'

function App() {
  return (
    <>
      <div className="app">
        <Navbar />
        <div className="page">
          <Dashboard />
        </div>
      </div>
    </>
  )
}

export default App
