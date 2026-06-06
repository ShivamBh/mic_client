import { useEffect, useRef, useState } from 'react';
import { useAbly } from 'ably/react';
import type * as Ably from 'ably';
import ViewportCursors from './ViewportCursors';
import LiveFeed from './LiveFeed';
import DonatePage from './DonateHome';
import convertSeconds from '../utils/time-format';
import bedIllustration from '../assets/bed-illustration.png';
import handIcon from '../assets/handicon.png';
import DownArrow from '../assets/down.svg';
import './museum-home-mobile.css';
import HandAnimPic from '../assets/hand_animation.gif';

const API_URL = import.meta.env.VITE_API_URL as string;

const HERO_TEXT = `Microrest is a website where you pay microworkers to rest.

Microworkers are the anonymous, remote online workers who train AI systems, moderate content, and translate text — the human labour that makes "automated" platforms work. They work for pennies, eyes fixed on the screen and wrists constantly moving — training the same AI systems that will eventually replace them.

For 25 cents, you can pay a worker to rest for 10 minutes. This fee is at the top end of what these workers are usually paid for their labour — to relentlessly click, select, drag.

To rest, workers simply leave their cursor on the screen and do nothing. No proof of rest is required.
`;

export default function MuseumHomeMobile() {
  const ably = useAbly();

  const [restingCount, setRestingCount] = useState(0);
  const [totalSecs, setTotalSecs] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const restingCountRef = useRef(0);
  const firstScreenRef = useRef<HTMLDivElement>(null);
  const [pillSticky, setPillSticky] = useState(false);

  useEffect(() => {
    const el = firstScreenRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setPillSticky(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/timer/state`)
      .then((r) => r.json())
      .then((data) => {
        setTotalSecs(data.totalSeconds ?? 0);
        setCompletedCount(data.totalRestingWorkers ?? 0);
        const initial = data.activeRestingWorkers ?? 0;
        setRestingCount(initial);
        restingCountRef.current = initial;
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const channel = ably.channels.get('microrest');
    const handler = (msg: Ably.InboundMessage) => {
      const event = msg.data as { state?: string };
      if (event?.state === 'resting') {
        restingCountRef.current += 1;
        setRestingCount(restingCountRef.current);
      } else if (event?.state === 'completed') {
        restingCountRef.current = Math.max(0, restingCountRef.current - 1);
        setRestingCount(restingCountRef.current);
      }
    };
    channel.subscribe('task_event', handler);
    return () => {
      channel.unsubscribe('task_event', handler);
    };
  }, [ably]);

  useEffect(() => {
    if (restingCount === 0) return;
    const id = setInterval(() => setTotalSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [restingCount]);

  return (
    <div className="mhm-root">
      <ViewportCursors />

      <div className="mhm-first-screen" ref={firstScreenRef}>
        <header className="mhm-header">
          <span className="mhm-logo">MICROREST</span>
        </header>

        <div className="mhm-hero"></div>

        <div className="mhm-pill-row">
          <img
            src={DownArrow}
            alt=""
            className={`mhm-scroll-hint${pillSticky ? ' mhm-scroll-hint--hidden' : ''}`}
          />
          <span className="mhm-pill">
            {restingCount} worker{restingCount !== 1 ? 's' : ''} resting
          </span>
        </div>
      </div>

      {pillSticky && (
        <div className="mhm-pill-row mhm-pill-row--fixed">
          <span className="mhm-pill">
            {restingCount} worker{restingCount !== 1 ? 's' : ''} resting
          </span>
        </div>
      )}

      <p className="mhm-hero-text">{HERO_TEXT}</p>
      <p className="mhm-donate-cta">DONATE BELOW ↓</p>

      <div className="mhm-section">
        <p className="mhm-stats">
          {completedCount} workers have trained no data for {convertSeconds(totalSecs)}
        </p>
        <h2 className="mhm-feed-heading">Log Data</h2>
        <div className="mhm-feed-wrapper">
          <LiveFeed apiUrl={API_URL} pageSize={16} />
        </div>
      </div>

      <div className="mhm-bed">
        <img src={HandAnimPic} alt="" />
      </div>

      <section id="mhm-donate" className="mhm-donate-section">
        <h2 className="mhm-donate-heading">Donate</h2>
        <p className="mhm-donate-desc">
          25 cents buys 10 minutes of rest. There is no tax receipt — this isn't a
          nonprofit, it's an art project. You will receive a signed certificate of donation.
          <br />
          <br />
          Funds are disbursed to workers weekly. For questions about donations contact{' '}
          <a href="mailto:studio@tarakelton.com">studio@tarakelton.com</a>.
        </p>
        <DonatePage />
      </section>

      <footer className="mhm-footer">
        <p className="mhm-footer-credit">
          Microrest is a project by{' '}
          <a href="https://tarakelton.com" target="_blank" rel="noreferrer">
            Tara Kelton
          </a>
        </p>
        <div className="mhm-footer-bottom">
          <img src={handIcon} alt="" className="mhm-hand-icon" />
          <span>© Tara Kelton 2026</span>
        </div>
      </footer>
    </div>
  );
}
