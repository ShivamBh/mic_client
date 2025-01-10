import { Link } from "react-router-dom";
import "../styles/content.css";
import { useCallback, useEffect, useState } from "react";
import supabase from "../utils/supabase";
import convertSeconds from "../utils/time-format";

function HomeContent() {
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
      <div className="home-content">
        <h1 className="header-mobile">Microrest</h1>
        <p className="content-block">
          Behind much of contemporary society’s technological wonders, is
          microworkers*. Grinding along in remote isolation, they label images,
          moderate content and transcribe text, the secret engine behind the
          platforms and systems that make up every part of contemporary life.
          Microwork is hyper-efficient extraction of labour where eyes must be
          continuously fixed on the screen and wrists constantly moving. Jobs
          are cut up into their smallest parts, removing all context and meaning
          for the labourers. This work is essential to training the same AI
          systems that will eventually render these workers obsolete. In
          microwork, not only is labour ceaseless, additional labour is stolen
          from the workers (during training they don’t get paid, their work can
          be rejected but still utilised by customers and they also supply free
          secondary data in the form of mouse tracking and eye tracking data).
        </p>
        <p className="content-block">
          As they work, they are timed and tracked with more and more efficiency
          and surveillance. Timers count down and algorithms rank their work in
          near real time. ‘1 minute left, 73 percent accurate’. If they take too
          long or lose focus, they’re instantly replaced by the next precarious
          worker waiting in line. Assembly line jobs at least came with coffee
          breaks and the ability to gather and unionise. Here, it is impossible
          to protest their conditions - the workers do not have the means to
          organise physically or otherwise (workers are temporary, software
          monitors everything they do and they can’t even supply bad data in
          protest). Microwork is the ultimate realisation of labour extraction.
          In MICROREST, I pay workers to rest their mouse, and simply stop
          working. Workers place their mouse on a specified location on screen,
          laying it to rest - and get paid as long as their mouse is inactive
          (and unproductive). The mouse no longer clicks, the microwork is
          paused, the AI training stops.
        </p>
        <p className="content-block">
          So far a total of {restData.count} workers have rested for{" "}
          {convertSeconds(restData.duration)}. To support the project, please{" "}
          <Link to={"/donate"} target="_blank" className="donation-link">
            donate
          </Link>
          .
        </p>
      </div>
    </>
  );
}

export default HomeContent;
