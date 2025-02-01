import "../museum.css";
import HomeUI from "./HomeUI";
import HomeContent from "./HomeContent";
import { useCallback, useEffect, useState } from "react";
import supabase from "../utils/supabase";

function MuseumHome() {
  const [restData, setRestData] = useState({
    count: 0,
    duration: 0,
  });

  const fetchRestData = useCallback(async () => {
    
    const count = await supabase
      .from("completed_rests")
      .select("*", { count: "exact", head: true });
    const totalRest = await supabase
      .from("completed_rests")
      .select("task_duration_in_secs.sum()");

    if (!totalRest || !totalRest.data) {
      return;
    }

    const totalDuration = totalRest.data[0].sum as number;
    const numWorkers = count.count as number;

    console.log("from parent called", totalDuration, numWorkers)

    setRestData({
      count: numWorkers,
      duration: totalDuration,
    });
  }, []);

  useEffect(() => {
    fetchRestData();
  }, []);

  return (
    <>
      <div className="home-container">
        <HomeUI onMemberChange={fetchRestData}/>
        <HomeContent restData={restData}/>
      </div>
    </>
  );
}

export default MuseumHome;
