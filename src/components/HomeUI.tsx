import { useCallback, useEffect, useState } from "react";
// import { useCursors } from "@ably/spaces/dist/mjs/react";
import CursorSvg from "./Cursor";
import { motion } from "framer-motion";
import "../styles/ui.css";
import { Realtime } from "ably";
import { nanoid } from "nanoid";
import Spaces from "@ably/spaces";
import PictureBox from "./PictureBox";

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
      const connected = spaceState.members.filter(
        (member) => member.isConnected
      );
      setWorkerCount(connected.length);
    });

    space.cursors.subscribe("update", (cursorUpdate) => {
      setCpos({
        x: cursorUpdate.position.x,
        y: cursorUpdate.position.y,
      });
    });
  }, []);

  useEffect(() => {
    initSpace();
  }, []);

  useEffect(() => {
    console.log(cPos);
  }, [cPos]);

  return (
    <>
      <div className="ui-container">
        <div className="ui-header">
          <h1 className="header-text">MICROREST</h1>
        </div>
        <div className="ui-window">
          {workerCount > 0 ? (
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
          ) : (
            <PictureBox />
          )}
        </div>
        <div className="ui-footer">
          <p className="worker-stats">
            {workerCount} worker
            {workerCount > 1 || workerCount === 0 ? "s" : ""} resting
          </p>
        </div>
      </div>

      <div className="ui-container ui-container-mobile">
        <div className="ui-center">
          <div className="ui-window">
            {workerCount > 0 ? (
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
            ) : (
              <PictureBox />
            )}
          </div>
          <div className="ui-footer">
            <p className="worker-stats">
              {workerCount} worker
              {workerCount > 1 || workerCount === 0 ? "s" : ""} resting
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeUI;
