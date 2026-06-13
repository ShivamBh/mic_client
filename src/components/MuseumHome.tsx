import '../museum.css';
import HomeUI from './HomeUI';
import { useEffect, useRef } from 'react';

const SCROLL_SPEED = 0.53;
const EASE_FACTOR = 0.1;

function MuseumHome() {
  const containerRef = useRef<HTMLDivElement>(null);
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

  return (
    <>
      <div className="home-container" ref={containerRef}>
        <HomeUI />
        {/* <HomeContent restData={restData}/> */}
      </div>
    </>
  );
}

export default MuseumHome;
