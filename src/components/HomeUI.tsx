import { useCallback, useEffect, useState } from "react";
// import { useCursors } from "@ably/spaces/dist/mjs/react";
import CursorSvg from "./Cursor";
import { motion } from "framer-motion";
import "../styles/ui.css";
import { Realtime } from "ably";
import { nanoid } from "nanoid";
import Spaces from "@ably/spaces";

const viewerMemberId = nanoid();

const client = new Realtime({
  clientId: viewerMemberId,
  key: import.meta.env.VITE_ABLY_KEY,
});

const spaces = new Spaces(client);

function HomeUI() {
  const [cPos, setCpos] = useState({ x: 0, y: 0 });
  const [workerCount, setWorkerCount] = useState(0);

  const initSpace = useCallback(async () => {
    const space = await spaces.get("resting-area");

    space.subscribe("update", (spaceState) => {
      console.log(`viewer`, viewerMemberId);
      console.log(`Space state`, spaceState);
      console.log(`members`, spaceState.members);
      setWorkerCount(spaceState.members.length);
    });

    space.cursors.subscribe("update", (cursorUpdate) => {
      console.log(
        `cursorUpdate:`,
        cursorUpdate.position.x,
        cursorUpdate.position.y
      );
      setCpos({
        x: cursorUpdate.position.x,
        y: cursorUpdate.position.y,
      });
    });
  }, []);

  useEffect(() => {
    initSpace();
  });

  return (
    <>
      <div className="ui-container">
        <div className="ui-header">
          <h1 className="header-text">MICROREST</h1>
        </div>
        <div className="ui-window">
          <div className="cursor-box">
            <motion.div
              className="cursor-mover"
              style={{
                position: "absolute",
                top: cPos.y,
                left: cPos.x,
                transformOrigin: "top left",
              }}
            >
              <CursorSvg />
            </motion.div>
          </div>
        </div>
        <div className="ui-footer">
          <p className="worker-stats">
            {workerCount} worker{workerCount > 1 ? "s" : ""} resting
          </p>
        </div>
      </div>
    </>
  );
}

export default HomeUI;
