import { useCallback, useEffect, useState } from 'react';
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
import HandAnimPic from '../assets/handanim.png';
import DownArrow from '../assets/down-arrow.png';
import DonatePage from './DonateHome';
import convertSeconds from '../utils/time-format';

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

function HomeUI({
  onMemberChange,
  restData,
}: {
  onMemberChange: () => void;
  restData: { count: number; duration: number };
}) {
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
    console.log(`restDATA`, restData);
    initSpace();
  }, []);

  return (
    <>
      <ViewportCursors />

      {/* Site header */}

      <div className="site-header">
        {/* <div className="site-name">MICROREST</div> */}
        <div className="site-stats">
          {activeMemberIds.length} worker{activeMemberIds.length != 1 ? 's' : ''} resting
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
              Microworkers are the anonymous, remote online workers who train AI systems, moderate
              content, and translate text — the human labour that makes "automated" platforms work.
              They work for pennies, eyes fixed on the screen and wrists constantly moving —
              training the same AI systems that will eventually replace them.
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

            <div className="scroll-icon">
              <img src={ScrollIconCurved} alt="Scroll Icon" />
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
            <img className="down-arrow" src={DownArrow} alt="" />
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
                For questions about donations contact studio@tarakelton.com. Funds are disbursed to
                workers daily.
              </p>
            </div>
            <div className="checkout-form">
              <DonatePage />
            </div>

            <div className="scroll-icon">
              <img className="down-arrow" src={DownArrow} alt="" />
            </div>
          </section>
          <section className="final">
            <div className="resting-interface">
              <p>
                This is a resting interface - buttons, scrollbars, all respond at a slow, laboured
                pace.
              </p>
            </div>
            <div className="sign-off">
              <i>
                Microrest is a project by artist <a href="www.tarakelton.com">Tara Kelton</a>
              </i>
            </div>
          </section>
        </div>
        <div className="feed-col">
          <div className="rest-stats">
            <p>
              {restData.count} workers have stopped training AI for{' '}
              {convertSeconds(restData.duration)}
            </p>
          </div>
          <div className="feed-container">
            <p className="feed-heading">Log Data</p>
            <LiveFeed apiUrl={import.meta.env.VITE_API_URL} />
          </div>
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
