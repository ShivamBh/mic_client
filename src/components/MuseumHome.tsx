import '../museum.css';
import HomeUI from './HomeUI';
import { useCallback, useEffect, useState } from 'react';
import HandIcon from '../assets/handicon.png';

const API_URL = import.meta.env.VITE_API_URL as string;

function MuseumHome() {
  const [restData, setRestData] = useState({
    count: 0,
    duration: 0,
  });

  const fetchRestData = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/rest-stats`);
    if (!res.ok) return;
    const data: { count: number; duration: number } = await res.json();
    setRestData(data);
  }, []);

  useEffect(() => {
    fetchRestData();
  }, []);

  return (
    <>
      <div className="home-container">
        <HomeUI restData={restData} onMemberChange={fetchRestData} />
        {/* <HomeContent restData={restData}/> */}
        <div className="site-footer">
          <div className="footer-icon">
            <img src={HandIcon} alt="Hand Icon" width={40} height={40} />
          </div>
          <div className="footer-text">
            <p>© Tara Kelton 2026</p>
          </div>
          <div className="footer-space"></div>
        </div>
      </div>
    </>
  );
}

export default MuseumHome;
