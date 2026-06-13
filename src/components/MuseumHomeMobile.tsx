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
  const [arrowHidden, setArrowHidden] = useState(false);

  useEffect(() => {
    const el = firstScreenRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setArrowHidden(!entry.isIntersecting), {
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
      </div>

      <div className="mhm-pill-row">
        <img
          src={DownArrow}
          alt=""
          className={`mhm-scroll-hint${arrowHidden ? ' mhm-scroll-hint--hidden' : ''}`}
        />
        <span className="mhm-pill">
          {restingCount} worker{restingCount !== 1 ? 's' : ''} resting
        </span>
      </div>

      <p className="mhm-hero-text">
        Microrest is a website where you pay microworkers to rest.{'\n\n'}
        <i>Microworkers</i> are the anonymous, remote online workers who train AI systems, moderate
        content, and translate text — the human labour that makes "automated" platforms work. They
        work for pennies, eyes fixed on the screen and wrists constantly moving — training the same
        AI systems that will eventually replace them.{'\n\n'}
        For 25 cents, you can pay a worker to rest for 10 minutes. This fee is at the top end of
        what these workers are usually paid for their labour — to relentlessly click, select, drag.
        {'\n\n'}
        To rest, workers simply leave their cursor on the screen and do nothing. No proof of rest is
        required.
      </p>
      <p className="mhm-donate-cta">
        <a href="/donate" target="_blank">
          DONATE
        </a>
      </p>

      <div className="mhm-section">
        <p className="mhm-stats">
          {completedCount} workers have trained no data for{' '}
          {totalSecs ? convertSeconds(totalSecs) : '0 days, 0 hours and 0 seconds'}
        </p>
        <h2 className="mhm-feed-heading">Log Data</h2>
        <div className="mhm-feed-wrapper">
          <LiveFeed apiUrl={API_URL} />
        </div>
      </div>

      <footer className="mhm-footer">
        <div className="mhm-footer-bottom">
          <img src={handIcon} alt="" className="mhm-hand-icon" />
          <span>
            ©{' '}
            <a
              href="https://tarakelton.com"
              target="_blank"
              rel="noreferrer"
              className="credit-link"
            >
              Tara Kelton
            </a>{' '}
            2026
          </span>
        </div>
      </footer>
    </div>
  );
}
