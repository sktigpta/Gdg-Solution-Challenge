import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isDesktop) {
    return <h2 className="mobile-warning">This app is only available on desktop.</h2>;
  }

  return (
    <div className="app">
      <Navbar />
      <div className="page">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
