import Spaces from "@ably/spaces";
import { Realtime } from "ably";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
import "../museum.css";
import { useCursors } from "@ably/spaces/dist/mjs/react";
import CursorSvg from "./Cursor";
import { motion } from "framer-motion";
import HomeUI from "./HomeUI";
import HomeContent from "./HomeContent";

const client = new Realtime({
  clientId: nanoid(),
  key: import.meta.env.VITE_ABLY_KEY,
});

const spaces = new Spaces(client);

function MuseumHome() {
  const [cPos, setCpos] = useState({ x: 0, y: 0 });

  const initSpace = useCallback(async () => {
    const space = await spaces.get("resting-area");

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

  // const getCursors = useCursors

  useEffect(() => {
    initSpace();
  });

  return (
    <>
      <div className="home-container">
        {/* <div
          className="cursor-box cursor-box-mus"
          style={{ position: "relative" }}
        >
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
        </div> */}
        <HomeUI />
        <HomeContent />
      </div>
    </>
  );
}

export default MuseumHome;
