import '../museum.css';
import HomeUI from './HomeUI';
import { useCallback, useEffect, useRef, useState } from 'react';
import HandIcon from '../assets/handicon.png';

const API_URL = import.meta.env.VITE_API_URL as string;

const SCROLL_SPEED = 0.3;

function MuseumHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [restData, setRestData] = useState({
    count: 0,
    duration: 0,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;
      if (e.deltaMode === 2) delta *= el.clientHeight;
      el.scrollBy(0, delta * SCROLL_SPEED);
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

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
      <div className="home-container" ref={containerRef}>
        <HomeUI restData={restData} onMemberChange={fetchRestData} />
        {/* <HomeContent restData={restData}/> */}
        <div className="site-footer">
          <div className="footer-icon">
            <img src={HandIcon} alt="Hand Icon" width={50} />
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
