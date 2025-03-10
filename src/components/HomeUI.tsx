import { useCallback, useEffect, useState } from "react";
// import { useCursors } from "@ably/spaces/dist/mjs/react";
import CursorSvg from "./Cursor";
import { motion } from "framer-motion";
import "../styles/ui.css";
import { Realtime } from "ably";
import { nanoid } from "nanoid";
import Spaces, { CursorUpdate, Members, SpaceMember } from "@ably/spaces";
import PictureBox from "./PictureBox";
import { useCursors } from "@ably/spaces/dist/mjs/react/useCursors";
import { useMembers } from "@ably/spaces/dist/mjs/react";
import { useMediaQuery } from "react-responsive";
import { usePresence } from "ably/react";

const viewerMemberId = nanoid();

const client = new Realtime({
  clientId: viewerMemberId,
  key: import.meta.env.VITE_ABLY_KEY,
});

const spaces = new Spaces(client);

function HomeUI({ onMemberChange }: { onMemberChange: () => void }) {


  const { cursors } = useCursors({ returnCursors: true });

  const [cursorStates, setCursorStates] = useState<Record<string, {
    member: SpaceMember,
    cursorUpdate: CursorUpdate
  }>>({})
  const [activeMemberIds, setActiveMemberIds] = useState<string[]>([])
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 800px)' })
  const [workers, setWorkers] = useState([]);
  const [workerCount, setWorkerCount] = useState(0);

  const removeMemberFromStoredCursors = (memberId: string) => {
    const cursorStates = JSON.parse(localStorage.getItem("microrest_cursor_states"))
    if (Object.keys(cursorStates).includes(memberId)) {
      const updatedCursors = delete cursorStates[memberId]
      localStorage.setItem("microrest_cursor_states", JSON.stringify(updatedCursors))
    }
  }

  const removeMemberIdFromStore = (memberId) => {
    const memberIds = JSON.parse(localStorage.getItem("microrest_active_mem_ids"))
    if (memberIds.includes(memberId)) {
      localStorage.setItem("microrest_active_mem_ids", JSON.stringify(memberIds.filter(id => id !== memberId)))
    }
  }

  const initSpace = (async () => {
    const space = await spaces.get("resting-area", {
    });

    const initActiveMembers = await space.members.getAll()
    const initActiveMemberIds = initActiveMembers.filter(mem => mem.isConnected == true).map(mem => mem.clientId)

    const storedCursorStates = localStorage.getItem("microrest_cursor_states") ? JSON.parse(localStorage.getItem("microrest_cursor_states")) : {}
    Object.keys(storedCursorStates).forEach(item => {
      storedCursorStates[item]["member"] = {
        clientId: storedCursorStates[item]["cursorUpdate"]["clientId"]
      }
    })

    setCursorStates(storedCursorStates)
    setActiveMemberIds(initActiveMemberIds)


    space.members.on("enter", async (member) => {
      const allActiveMembers = await space.members.getAll()
      const trueConn = allActiveMembers.filter(mem => mem.isConnected == true)
      const updatedMemberIds = allActiveMembers.filter(mem => mem.isConnected === true).map(mem => mem.clientId)
      setActiveMemberIds(updatedMemberIds)
      setWorkerCount(updatedMemberIds.length)
    });

    space.members.on("leave", async (member) => {
      const all = await space.members.getAll()
      const updatedWorkers = workers.filter(
        (item) => item.clientId !== member.clientId
      );
      setActiveMemberIds((prev) => {
        return prev.filter(item => item !== member.clientId)
      })
      removeMemberFromStoredCursors(member.clientId)
    });
  })

  useEffect(() => {
    localStorage.setItem("microrest_active_mem_ids", JSON.stringify(activeMemberIds))
  }, [activeMemberIds])

  useEffect(() => {
    setCursorStates(cursors)

  }, [cursors])


  useEffect(() => {
    if (Object.keys(cursors).length > 0) {
      localStorage.setItem("microrest_cursor_states", JSON.stringify(cursors))
    }


  }, [cursorStates])


  useEffect(() => {
    // setWorkerCount(workers.length);
    onMemberChange()
  }, [workerCount]);

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


            {
              activeMemberIds.length > 0 && Object.keys(cursorStates).length > 0 && typeof cursorStates === "object" ? Object.values(cursorStates)
                .filter(state => activeMemberIds.includes(state.member.clientId))
                .map(data => {
                  const cursorUpdate = data.cursorUpdate as any;
                  const member = data.member as any;
                  if (cursorUpdate.data.state === "leave") return;
                  return (
                    <motion.div
                      key={member.connectionId}
                      id={`member-cursor-${member.connectionId}`}
                      className="cursor-mover"
                      animate={{
                        top: `${data.cursorUpdate.position.y - 35}px`,
                        left: `${data.cursorUpdate.position.x - 35}px`,
                      }}
                      style={{
                        position: "absolute",
                        transformOrigin: "top left",
                      }}
                    >
                      <CursorSvg />
                    </motion.div>
                  )
                }) : <PictureBox></PictureBox>
            }
          </div>
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
          <div className="ui-window">
            <div className="cursor-box">
              {
                activeMemberIds.length > 0 && Object.keys(cursorStates).length > 0 && typeof cursorStates === "object" ? Object.values(cursorStates)
                  .filter(state => activeMemberIds.includes(state.member.clientId))
                  .map(data => {
                    const cursorUpdate = data.cursorUpdate as any;
                    const member = data.member as any;
                    if (cursorUpdate.data.state === "leave") return;
                    return (
                      <motion.div
                        key={member.connectionId}
                        id={`member-cursor-${member.connectionId}`}
                        className="cursor-mover"
                        animate={{
                          top: `${data.cursorUpdate.position.y * 280 / 400 - 24}px`,
                          left: `${data.cursorUpdate.position.x * 280 / 400 - 24}px`,
                        }}
                        style={{
                          position: "absolute",
                          transformOrigin: "top left",
                        }}
                      >
                        <CursorSvg />
                      </motion.div>
                    )
                  }) : <PictureBox></PictureBox>
              }
            </div>
          </div>
          <div className="ui-footer">
            <p className="worker-stats">
              {activeMemberIds.length} worker
              {activeMemberIds.length > 1 || activeMemberIds.length === 0 ? "s" : ""} resting
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeUI;
