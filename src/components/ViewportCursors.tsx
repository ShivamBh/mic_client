import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSpace } from '@ably/spaces/dist/mjs/react';
import type { CursorUpdate, SpaceMember } from '@ably/spaces';
import { useMediaQuery } from 'react-responsive';
import cursorWhiteBg from '../assets/cursor_whitebg_smaller.svg';

export default function ViewportCursors() {
  const { space } = useSpace();
  const [cursors, setCursors] = useState<Record<string, CursorUpdate>>({});
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const cursorSize = isMobile ? 64 : 84;

  useEffect(() => {
    if (!space) return;

    space.cursors
      .getAll()
      .then((initial) => {
        setCursors((prev) => ({ ...prev, ...initial }));
      })
      .catch((err) => console.warn('[ViewportCursors] cursors.getAll failed:', err));

    const cursorHandler = (update: CursorUpdate) => {
      setCursors((prev) => ({ ...prev, [update.connectionId]: update }));
    };

    const leaveHandler = (member: SpaceMember) => {
      setCursors((prev) => {
        const next = { ...prev };
        delete next[member.connectionId];
        return next;
      });
    };

    space.cursors.subscribe('update', cursorHandler);
    space.members.subscribe('leave', leaveHandler);

    return () => {
      space.cursors.unsubscribe('update', cursorHandler);
      space.members.unsubscribe('leave', leaveHandler);
    };
  }, [space]);

  const active = Object.values(cursors).filter(
    (c) => c != null && c.data?.state !== 'leave' && c.position
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {active.map((cursor) => (
        <motion.img
          key={cursor.connectionId}
          src={cursorWhiteBg}
          alt=""
          width={cursorSize}
          height={cursorSize}
          style={{ position: 'fixed', transform: 'translate(-12px, -8px)' }}
          animate={{
            left: `${cursor.position.x * 100}vw`,
            top: `${cursor.position.y * 100}vh`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      ))}
    </div>
  );
}
