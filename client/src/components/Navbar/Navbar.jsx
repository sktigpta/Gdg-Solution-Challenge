import { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <nav>
      <h3>Safeguarding Stories: AI for Intellectual Property Protection</h3>
      <p>{time}</p>
    </nav>
  );
}

export default Navbar;
