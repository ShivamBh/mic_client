import { useCallback, useEffect, useState } from "react";
import "../styles/ui.css";
import PictureBox from "./PictureBox";
import { useMediaQuery } from "react-responsive";



function ArchiveUI({ onMemberChange }: { onMemberChange: () => void }) {


  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 800px)' })
  // const [workers, setWorkers] = useState([]);
  const [workerCount, setWorkerCount] = useState(0);

  useEffect(() => {
    // setWorkerCount(workers.length);
    onMemberChange()
  }, [workerCount]);

  return (
    <>
      <div className="ui-container">
        <div className="ui-header">
          <h1 className="header-text">MICROREST</h1>
        </div>
        <div className="ui-window">
          <div className="cursor-box">


            <PictureBox></PictureBox>
          </div>
        </div>
        <div className="ui-footer" style={{
          visibility: "hidden"
        }}>
          <p className="worker-stats">

          </p>
        </div>
      </div>

      <div className="ui-container ui-container-mobile">
        <div className="ui-center">
          <div className="ui-window">
            <div className="cursor-box">
              <PictureBox></PictureBox>
            </div>
          </div>
          <div className="ui-footer" style={{
            visibility: "hidden"
          }}>
            <p className="worker-stats">

            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ArchiveUI;
