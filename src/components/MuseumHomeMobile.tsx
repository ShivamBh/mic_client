import { useEffect, useRef, useState } from 'react';
import { useAbly } from 'ably/react';
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
  // Connected & active workers: every distinct workerId present in `microrest`
  // presence (accepted + resting + idle), i.e. everyone who started the task and
  // hasn't completed/disconnected. Drives the header counter. restingCount (only
  // those whose cursor is currently still) stays the timer's accrual source.
  const [activeCount, setActiveCount] = useState(0);
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

  // Sync timer state from the server (source of truth) on mount and periodically.
  // totalSeconds already accumulates proportionally server-side (sum of active
  // sessions), so re-syncing keeps the museum authoritative and corrects drift.
  useEffect(() => {
    const syncTimerState = () => {
      fetch(`${API_URL}/api/timer/state`)
        .then((r) => r.json())
        .then((data) => {
          // totalSecs and completedCount are owned by the server sync;
          // restingCount is owned by the live presence listener below.
          setTotalSecs(data.totalSeconds ?? 0);
          setCompletedCount(data.totalRestingWorkers ?? 0);
        })
        .catch(() => {});
    };
    syncTimerState();
    const id = setInterval(syncTimerState, 20000);
    return () => clearInterval(id);
  }, []);

  // Live resting count from Ably presence — the same source of truth the server
  // uses (timer-service handlePresenceChange). Workers publish state via presence
  // (resting / idle on move / leave on disconnect), so this drops the instant a
  // worker stops resting, unlike the old task_event stream which only decremented
  // on 'completed'. Count distinct workerIds to avoid double-counting a reloaded
  // worker whose stale presence member lingers until cleanup.
  useEffect(() => {
    const channel = ably.channels.get('microrest');
    let cancelled = false;

    const recount = async () => {
      try {
        const members = await channel.presence.get();
        const data = members.map(
          (m) => m.data as { state?: string; workerId?: string } | undefined
        );
        // All connected & active workers (any presence state) — header counter.
        const active = new Set(
          data.filter((d) => d?.workerId).map((d) => d!.workerId as string)
        );
        // Currently-resting subset — feeds the timer accrual only.
        const resting = new Set(
          data
            .filter((d) => d?.state === 'resting' && d?.workerId)
            .map((d) => d!.workerId as string)
        );
        if (cancelled) return;
        restingCountRef.current = resting.size;
        setRestingCount(resting.size);
        setActiveCount(active.size);
      } catch {
        /* ignore transient presence errors */
      }
    };

    recount();
    channel.presence.subscribe(['enter', 'update', 'leave'], recount);
    return () => {
      cancelled = true;
      channel.presence.unsubscribe(recount);
    };
  }, [ably]);

  // Interpolate totalSecs between server syncs at one tick per resting worker per
  // second: N workers -> N updates/sec -> total climbs ~N sec/sec. Period floored
  // at 50ms (<=20 updates/sec) to avoid render thrash at high counts, with a
  // compensating step so the accumulation rate stays ~= restingCount/sec.
  useEffect(() => {
    if (restingCount <= 0) return;
    const period = Math.max(Math.floor(1000 / restingCount), 50);
    const step = Math.max(1, Math.round((restingCount * period) / 1000));
    const id = setInterval(() => setTotalSecs((s) => s + step), period);
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
          {activeCount} worker{activeCount !== 1 ? 's' : ''} resting
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
