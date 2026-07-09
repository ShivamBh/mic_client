import { useCallback, useEffect, useRef, useState } from 'react';
// import { useCursors } from "@ably/spaces/dist/mjs/react";
import CursorSvg from './Cursor';
import { motion } from 'framer-motion';
import '../styles/ui.css';
import { Realtime } from 'ably';
import { nanoid } from 'nanoid';
import Spaces, { CursorUpdate, Members, SpaceMember } from '@ably/spaces';
import PictureBox from './PictureBox';
import { useCursors } from '@ably/spaces/dist/mjs/react/useCursors';
import { useMembers } from '@ably/spaces/dist/mjs/react';
import { useMediaQuery } from 'react-responsive';
import { usePresence } from 'ably/react';
import ViewportCursors from './ViewportCursors';
import LiveFeed from './LiveFeed';
import ScrollIconCurved from '../assets/scroll-icon.png';
// import HandAnim from '../assets/handanimation.webm';
import HandAnimPic from '../assets/hand_animation.gif';
import DownArrow from '../assets/down.svg';
import DonatePage from './DonateHome';
import convertSeconds from '../utils/time-format';
import HandIcon from '../assets/handicon.png';

// import handAnimation from '../assets/handanimation.mov';

// function HandAnimation() {
//   return (
//     <video autoPlay loop muted playsInline>
//       <source src={handAnimation} type="video/quicktime" />
//     </video>
//   );
// }

const HERO_TEXT = `Microrest is a website where you pay microworkers to rest.

Microworkers are the anonymous, remote online workers who train AI systems, moderate content, and translate text — the human labour that makes "automated" platforms work. They work for pennies, eyes fixed on the screen and wrists constantly moving — training the same AI systems that will eventually replace them.

For 25 cents, you can pay a worker to rest for 10 minutes. This fee is at the top end of what these workers are usually paid for their labour — to relentlessly click, select, drag.

To rest, workers simply leave their cursor on the screen and do nothing. No proof of rest is required.

Mouse cursors you see on this screen are currently resting workers.`;

const viewerMemberId = nanoid();

const client = new Realtime({
  clientId: viewerMemberId,
  key: import.meta.env.VITE_ABLY_KEY,
});

const spaces = new Spaces(client);

const API_URL = import.meta.env.VITE_API_URL as string;

function HomeUI({ onMemberChange = () => {} }: { onMemberChange?: () => void }) {
  const { cursors } = useCursors({ returnCursors: true });

  const [cursorStates, setCursorStates] = useState<
    Record<
      string,
      {
        member: SpaceMember;
        cursorUpdate: CursorUpdate;
      }
    >
  >({});
  const [activeMemberIds, setActiveMemberIds] = useState<string[]>([]);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 800px)' });
  const [workers, setWorkers] = useState([]);
  const [workerCount, setWorkerCount] = useState(0);
  const [totalSecs, setTotalSecs] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [restingCount, setRestingCount] = useState(0);
  // Connected & active workers: every distinct workerId present in `microrest`
  // presence (accepted + resting + idle), i.e. everyone who started the task and
  // hasn't completed/disconnected. Drives the header counter. restingCount (only
  // those whose cursor is currently still) stays the timer's accrual source.
  const [activeCount, setActiveCount] = useState(0);
  const restingCountRef = useRef(0);

  const removeMemberFromStoredCursors = (memberId: string) => {
    const cursorStates = JSON.parse(localStorage.getItem('microrest_cursor_states'));
    if (Object.keys(cursorStates).includes(memberId)) {
      const updatedCursors = delete cursorStates[memberId];
      localStorage.setItem('microrest_cursor_states', JSON.stringify(updatedCursors));
    }
  };

  const removeMemberIdFromStore = (memberId) => {
    const memberIds = JSON.parse(localStorage.getItem('microrest_active_mem_ids'));
    if (memberIds.includes(memberId)) {
      localStorage.setItem(
        'microrest_active_mem_ids',
        JSON.stringify(memberIds.filter((id) => id !== memberId))
      );
    }
  };

  const initSpace = async () => {
    const space = await spaces.get('resting-area', {});

    const initActiveMembers = await space.members.getAll();
    const initActiveMemberIds = initActiveMembers
      .filter((mem) => mem.isConnected == true)
      .map((mem) => mem.clientId);

    const storedCursorStates = localStorage.getItem('microrest_cursor_states')
      ? JSON.parse(localStorage.getItem('microrest_cursor_states'))
      : {};
    Object.keys(storedCursorStates).forEach((item) => {
      storedCursorStates[item]['member'] = {
        clientId: storedCursorStates[item]['cursorUpdate']['clientId'],
      };
    });

    setCursorStates(storedCursorStates);
    setActiveMemberIds(initActiveMemberIds);

    space.members.on('enter', async (member) => {
      const allActiveMembers = await space.members.getAll();
      const trueConn = allActiveMembers.filter((mem) => mem.isConnected == true);
      const updatedMemberIds = allActiveMembers
        .filter((mem) => mem.isConnected === true)
        .map((mem) => mem.clientId);
      setActiveMemberIds(updatedMemberIds);
      setWorkerCount(updatedMemberIds.length);
    });

    space.members.on('leave', async (member) => {
      const all = await space.members.getAll();
      const updatedWorkers = workers.filter((item) => item.clientId !== member.clientId);
      setActiveMemberIds((prev) => {
        return prev.filter((item) => item !== member.clientId);
      });
      removeMemberFromStoredCursors(member.clientId);
    });
  };

  useEffect(() => {
    localStorage.setItem('microrest_active_mem_ids', JSON.stringify(activeMemberIds));
  }, [activeMemberIds]);

  useEffect(() => {
    setCursorStates(cursors);
  }, [cursors]);

  useEffect(() => {
    if (Object.keys(cursors).length > 0) {
      localStorage.setItem('microrest_cursor_states', JSON.stringify(cursors));
    }
  }, [cursorStates]);

  useEffect(() => {
    // setWorkerCount(workers.length);
    onMemberChange();
  }, [workerCount]);

  useEffect(() => {
    initSpace();
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
    const channel = client.channels.get('microrest');
    let cancelled = false;

    const recount = async () => {
      try {
        const members = await channel.presence.get();
        const data = members.map(
          (m) => m.data as { state?: string; workerId?: string } | undefined
        );
        // All connected & active workers (any presence state) — header counter.
        const active = new Set(data.filter((d) => d?.workerId).map((d) => d!.workerId as string));
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
  }, []);

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
    <>
      <ViewportCursors />

      {/* Site header */}

      <div className="site-header">
        {/* <div className="site-name">MICROREST</div> */}
        <div className="site-stats">
          {activeCount} worker{activeCount != 1 ? 's' : ''} resting
        </div>
        {/* <div className="spacer-r">{" "}</div> */}
      </div>

      <div className="site-content">
        <div className="content-col">
          <section className="banner">
            <p className="sitename">MICROREST</p>

            <h1 className="hero-text">
              Microrest is a website where you pay microworkers to rest.
              <br />
              <br />
              <i>Microworkers</i> are the anonymous, remote online workers who train AI systems,
              moderate content, and translate text — the human labour that makes "automated"
              platforms work. They work for pennies, eyes fixed on the screen and wrists constantly
              moving — training the same AI systems that will eventually replace them.
              <br /> <br />
              For 25 cents, you can pay a worker to rest for 10 minutes. This fee is at the top end
              of what these workers are usually paid for their labour – to relentlessly click,
              select, drag.
              <br /> <br />
              To rest, workers simply leave their cursor on the screen and do nothing. No proof of
              rest is required.
              <br /> <br />
              DONATE BELOW
            </h1>

            <div className="scroll-icon scroll-icon-first">
              <img src={DownArrow} alt="Scroll Icon" />
            </div>
          </section>

          <section className="donation">
            <div className="donate-heading">
              <h2>Donate</h2>
            </div>
            <div className="donate-subheading">
              <p>
                25 cents buys 10 minutes of rest. There is no tax receipt — this isn't a nonprofit,
                it's an art project. You will receive a signed certificate of donation.
              </p>
              <p>
                Funds are disbursed to workers weekly. For questions about donations contact
                <a href="mailto:studio@tarakelton.com"> studio@tarakelton.com</a>.
              </p>
            </div>
            <div className="checkout-form">
              <DonatePage />
            </div>
            <div className="scroll-icon last-icon">
              <img className="down-arrow" src={DownArrow} alt="" />
            </div>
            <div className="sign-off">
              <i>
                Microrest is a project by <a href="www.tarakelton.com">Tara Kelton</a>
              </i>
            </div>
          </section>
          <section className="hand-animation">
            <img className="hand-anim" src={HandAnimPic} alt="hand anim" />
            {/* <video
              src={HandAnim}
              autoPlay
              loop
              aria-label="hand animation loop"
              height={200}
              width={200}
            ></video> */}
            {/* <img className="down-arrow" src={DownArrow} alt="" /> */}
          </section>
        </div>
        <div className="feed-col">
          <div className="rest-stats">
            <p>
              {completedCount} workers have stopped training AI for{' '}
              {totalSecs > 0 ? convertSeconds(totalSecs) : '0 days, 0 hours and 0 seconds'}
            </p>
            <p className="feed-heading">Log Data</p>
          </div>
          <div className="feed-container">
            <LiveFeed apiUrl={import.meta.env.VITE_API_URL} />
          </div>
          <section className="final">
            <div className="resting-interface">
              <p>
                This is a resting interface - buttons, scrollbars, all respond at a slow, laboured
                pace.
              </p>
            </div>
          </section>
        </div>
      </div>
      <div className="site-footer">
        <div className="footer-icon">
          <img src={HandIcon} alt="Hand Icon" width={55} />
        </div>
        <div className="footer-text">
          <p>© Tara Kelton 2026</p>
        </div>
      </div>

      {/* <div className="ui-container">
        <div className="ui-header">
          <h1 className="header-text">MICROREST</h1>
        </div>
        <div className="ui-footer">
          <p className="worker-stats">
            {activeMemberIds.length} worker
            {activeMemberIds.length > 1 || activeMemberIds.length === 0 ? "s" : ""} resting
          </p>
        </div>
      </div>

      <div className="ui-container ui-container-mobile">
        <div className="ui-center">
          <div className="ui-footer">
            <p className="worker-stats">
              {activeMemberIds.length} worker
              {activeMemberIds.length > 1 || activeMemberIds.length === 0 ? "s" : ""} resting
            </p>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default HomeUI;
