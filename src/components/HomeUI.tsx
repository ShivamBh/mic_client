import { useCallback, useEffect, useState } from "react";
// import { useCursors } from "@ably/spaces/dist/mjs/react";
import CursorSvg from "./Cursor";
import { motion } from "framer-motion";
import "../styles/ui.css";
import { Realtime } from "ably";
import { nanoid } from "nanoid";
import Spaces, { CursorUpdate, Members } from "@ably/spaces";
import PictureBox from "./PictureBox";
import { useCursors } from "@ably/spaces/dist/mjs/react/useCursors";
import { useMembers } from "@ably/spaces/dist/mjs/react";

const viewerMemberId = nanoid();

const client = new Realtime({
  clientId: viewerMemberId,
  key: import.meta.env.VITE_ABLY_KEY,
});

const spaces = new Spaces(client);

function HomeUI() {
  const [workers, setWorkers] = useState([]);
  const [workerCount, setWorkerCount] = useState(0);
  // useMembers("enter", (member) => {
  //   console.log("entered", member);
  //   setWorkerCount(workerCount + 1);
  // });

  // useMembers("leave", (member) => {
  //   console.log("left", member);
  //   setWorkerCount(workerCount - 1);
  // });

  const initSpace = useCallback(async () => {
    const space = await spaces.get("resting-area");

    space.members.on("enter", (member) => {
      console.log("entered", member);
      const newWorker = {
        clientId: member.clientId,
        x: Math.floor(Math.random() * 200),
        y: Math.floor(Math.random() * 200),
      };
      const updatedWorkers = [...workers, newWorker];
      setWorkers(updatedWorkers);
      setWorkerCount(updatedWorkers.length)
    });

    space.members.on("leave", (member) => {
      console.log("exited", member);
      const updatedWorkers = workers.filter(
        (item) => item.clientId !== member.clientId
      );

      setWorkers(updatedWorkers);
      setWorkerCount(updatedWorkers.length)

    });

    // space.subscribe("update", (spaceState) => {
    //   const connectedMembersIds = spaceState.members
    //     .filter((member) => member.isConnected === true)
    //     .map((item) => item.clientId);

    //   const connectedWorkers = workers.filter((worker) =>
    //     connectedMembersIds.includes(worker.clientId)
    //   );

    //   setWorkers(connectedWorkers);
    //   // setWorkerCount(connectedMembersIds.length);
    // });

    space.subscribe("update", (spaceState) => {
      const connected = spaceState.members.filter(
        (member) => member.isConnected
      );
      console.log("conn", connected)
      // setWorkerCount(connected.length);
    });

    space.cursors.subscribe("update", async (cursorUpdate) => {
      const mem = await space.members.getAll();
      console.log("members", mem);

      const connected = mem.filter((item) => item.isConnected);

      // setWorkerCount(connected.length);

      setWorkers((prev) => {
        const nonUpdates = prev.filter(
          (item) => item.clientId !== cursorUpdate.clientId
        );
        const updated = {
          clientId: cursorUpdate.clientId,
          x: cursorUpdate.position.x,
          y: cursorUpdate.position.y,
        };
        const newWorkerState = [...nonUpdates, updated];
        return newWorkerState;
      });
    });
  }, []);

  useEffect(() => {
    // setWorkerCount(workers.length);
  }, [workers]);

  useEffect(() => {
    initSpace();
  }, []);

  return (
    <>
      <div className="ui-container">
        <div className="ui-header">
          <h1 className="header-text">MICROREST</h1>
        </div>
        <div className="ui-window">
          <div className="cursor-box">
            {workerCount > 0 ? (
              workers.map((worker) => (
                <>
                  <motion.div
                    className="cursor-mover"
                    style={{
                      position: "absolute",
                      transform: `translate3d(${worker.x > 280 ? 280 : worker.x}px, ${worker.y > 280 ? 280 : worker.y}px, 0)`,
                      transformOrigin: "top left",
                    }}
                  >
                    <CursorSvg />
                  </motion.div>
                </>
              ))
            ) : (
              <PictureBox />
            )}
          </div>
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
            <div className="cursor-box">
              {workerCount > 0 ? (
                workers.map((worker) => (
                  <>
                    <motion.div
                      className="cursor-mover"
                      style={{
                        position: "absolute",
                        transform: `translate3d(${worker.x > 280 ? 280 : worker.x}px, ${worker.y > 280 ? 280 : worker.y}px, 0)`,
                        transformOrigin: "top left",
                      }}
                    >
                      <CursorSvg />
                    </motion.div>
                  </>
                ))
              ) : (
                <PictureBox />
              )}
            </div>
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
