import '../museum.css';
import HomeUI from './HomeUI';
import { useCallback, useEffect, useRef, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL as string;

const SCROLL_SPEED = 0.33;
const EASE_FACTOR = 0.1;

function MuseumHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [restData, setRestData] = useState({
    count: 0,
    duration: 0,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let targetScroll = el.scrollTop;
    let rafId: number | null = null;

    const animate = () => {
      const diff = targetScroll - el.scrollTop;
      if (Math.abs(diff) < 0.5) {
        el.scrollTop = targetScroll;
        rafId = null;
        return;
      }
      el.scrollTop += diff * EASE_FACTOR;
      rafId = requestAnimationFrame(animate);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;
      if (e.deltaMode === 2) delta *= el.clientHeight;
      targetScroll = Math.max(
        0,
        Math.min(el.scrollHeight - el.clientHeight, targetScroll + delta * SCROLL_SPEED)
      );
      if (rafId === null) rafId = requestAnimationFrame(animate);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
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
      </div>
    </>
  );
}

export default MuseumHome;
