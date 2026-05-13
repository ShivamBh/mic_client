import { useEffect, useRef, useState } from 'react';
import { useAbly } from 'ably/react';
import * as Ably from 'ably';
import { useMediaQuery } from 'react-responsive';
import ViewportCursors from './ViewportCursors';
import LiveFeed from './LiveFeed';
import convertSeconds from '../utils/time-format';
import bedIllustration from '../assets/bed-illustration.png';
import handIcon from '../assets/handicon.png';
import '../styles/updated-museum.css';

const API_URL = import.meta.env.VITE_API_URL as string;

const HERO_TEXT = `Microrest is a website where you pay microworkers to rest.

Microworkers are the anonymous, remote online workers who train AI systems, moderate content, and translate text — the human labour that makes "automated" platforms work. They work for pennies, eyes fixed on the screen and wrists constantly moving — training the same AI systems that will eventually replace them.

For 25 cents, you can pay a worker to rest for 10 minutes. This fee is at the top end of what these workers are usually paid for their labour — to relentlessly click, select, drag.

To rest, workers simply leave their cursor on the screen and do nothing. No proof of rest is required.

Mouse cursors you see on this screen are currently resting workers.`;

export default function UpdatedMuseumPage() {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const ably = useAbly();

  const [restingCount, setRestingCount] = useState(0);
  const [totalSecs, setTotalSecs] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const restingCountRef = useRef(0);

  // Fetch initial state from server — mirrors TimerService.syncActiveSessions()
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

  // Live worker count via task_event messages — mirrors TimerService.handleMessage()
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
    return () => { channel.unsubscribe('task_event', handler); };
  }, [ably]);

  // Live-tick total seconds while workers are resting
  useEffect(() => {
    if (restingCount === 0) return;
    const id = setInterval(() => setTotalSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [restingCount]);

  return (
    <div className="museum-v2">
      <ViewportCursors />

      <header className="museum-header">
        {!isMobile && <span className="museum-logo">microrest</span>}
        <span className="workers-pill">{restingCount} workers resting</span>
      </header>

      {isMobile ? (
        <MobileLayout totalSecs={totalSecs} completedCount={completedCount} />
      ) : (
        <DesktopLayout totalSecs={totalSecs} completedCount={completedCount} />
      )}
    </div>
  );
}

function DesktopLayout({ totalSecs, completedCount }: { totalSecs: number; completedCount: number }) {
  return (
    <>
      <main className="museum-main">
        <div className="museum-left">
          <p className="hero-text">{HERO_TEXT}</p>
          <div className="bed-illustration">
            <img src={bedIllustration} alt="Bed illustration" />
          </div>
          <a href="#donate" className="donate-cta">DONATE BELOW ↓</a>
        </div>

        <div className="museum-divider" />

        <div className="museum-right">
          <p className="stats-counter">
            {completedCount} workers have trained no data for {convertSeconds(totalSecs)}
          </p>
          <h2 className="feed-heading">Log Data</h2>
          <LiveFeed apiUrl={API_URL} className="live-feed-container" />
        </div>
      </main>

      <DonateSection />
      <SiteFooter />
    </>
  );
}

function MobileLayout({ totalSecs, completedCount }: { totalSecs: number; completedCount: number }) {
  return (
    <>
      <div className="mobile-hero">
        <span className="mobile-scroll-hint">↓</span>
      </div>

      <div className="mobile-workers-pill">
        <span className="workers-pill">
          {completedCount} workers have trained no data for {convertSeconds(totalSecs)}
        </span>
      </div>

      <div className="mobile-section">
        <h2 className="feed-heading">Log Data</h2>
        <div className="mobile-feed-wrapper">
          <LiveFeed apiUrl={API_URL} pageSize={16} />
        </div>
      </div>

      <p className="mobile-hero-text">{HERO_TEXT}</p>

      <div className="mobile-bed">
        <img src={bedIllustration} alt="Bed illustration" />
      </div>

      <a href="#donate" className="mobile-donate-cta">DONATE BELOW ↓</a>

      <DonateSection />
      <SiteFooter />
    </>
  );
}

function DonateSection() {
  return (
    <section className="donate-section" id="donate">
      <h2>Donate</h2>
      <p className="donate-description">
        $0.25 buys 10 minutes of rest. Any amount is fine. There is no tax receipt —
        this isn't a nonprofit, it's an art project. You will receive a signed
        certificate of donation.
        <br /><br />
        For questions about donations contact{' '}
        <a href="mailto:hello@micro.rest">hello@micro.rest</a>
        <br />
        Funds are disbursed to workers daily.
      </p>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="museum-footer">
      <div className="footer-left">
        <p className="footer-slow-note">
          This is a resting interface — buttons, scrollbars, all respond at a slow,
          laboured pace.
        </p>
        <p className="footer-credit">
          Microrest is a project by{' '}
          <a href="https://tarakelton.com" target="_blank" rel="noreferrer">
            Tara Kelton
          </a>
        </p>
      </div>
      <div className="footer-right">
        <img src={handIcon} alt="" className="hand-icon" />
        <span>© Tara Kelton 2026</span>
      </div>
    </footer>
  );
}
