import Spaces from "@ably/spaces";
import { Realtime } from "ably";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
import "../worker.css";

const client = new Realtime({
  clientId: nanoid(),
  key: import.meta.env.VITE_ABLY_KEY,
});

const generateWorkerId = () => {
  return nanoid(16);
};
const restTimer = () => {};

const THROTTLE_SECS = 150;

const spaces = new Spaces(client);
const space = await spaces.get("resting-area");
await space.enter({ name: "worker-1" });

function WorkersHome() {
  const [cursorState, setCursorState] = useState({
    x: 0,
    y: 0,
    lastUpdated: Date.now(),
  });
  const handleCursorMove = (e: React.MouseEvent) => {
    let rect = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    console.log(x, y);
    if (
      cursorState.lastUpdated &&
      Date.now() - cursorState.lastUpdated < THROTTLE_SECS
    ) {
      return;
    }

    setCursorState({
      x: x,
      y: y,
      lastUpdated: Date.now(),
    });

    space.cursors.set({
      position: { x: e.clientX, y: e.clientY },
      data: { meta: "test-1" },
    });
  };

  useEffect(() => {});

  return (
    <>
      <div style={{ height: "100vh", width: "100vw" }}>
        <div className="cursor-box" onMouseMove={handleCursorMove}></div>
      </div>
    </>
  );
}

export default WorkersHome;
