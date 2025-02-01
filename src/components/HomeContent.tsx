import { Link } from "react-router-dom";
import "../styles/content.css";
import { useCallback, useEffect, useState } from "react";
import supabase from "../utils/supabase";
import convertSeconds from "../utils/time-format";

function HomeContent({restData}: {restData: {count: number, duration: number}}) {
  // const [restData, setRestData] = useState({
  //   count: 0,
  //   duration: 0,
  // });

  // const fetchRestData = useCallback(async () => {
  //   const count = await supabase
  //     .from("completed_rests")
  //     .select("*", { count: "exact", head: true });
  //   const totalRest = await supabase
  //     .from("completed_rests")
  //     .select("task_duration_in_secs.sum()");

  //   if (!totalRest || !totalRest.data) {
  //     return;
  //   }

  //   const totalDuration = totalRest.data[0].sum as number;
  //   const numWorkers = count.count as number;

  //   setRestData({
  //     count: numWorkers,
  //     duration: totalDuration,
  //   });
  // }, []);

  // useEffect(() => {
  //   fetchRestData();
  // }, []);

  return (
    <>
      <div className="home-content">
        <h1 className="header-mobile">Microrest</h1>
        <p className="content-block">
        Behind much of contemporary society’s technological wonders, is microworkers*. Grinding along in remote isolation, they label images, moderate content and transcribe text, the secret engine behind the platforms and systems that make up every part of contemporary life. Microwork is hyper-efficient extraction of labour where eyes must be continuously fixed on the screen and wrists constantly moving. Jobs are cut up into their smallest parts, removing all context and meaning for the workers.
        </p>
        <p className="content-block">
        Microwork is essential to training the same AI systems that will eventually render these workers obsolete. In microwork, not only is labour ceaseless, additional labour is stolen from the workers (they are not paid during training, their work is often formally rejected but still utilised and additional mouse tracking and eye tracking data is taken from them without any compensation).
        </p>
        <p className="content-block">Microwork is the ultimate realisation of labour extraction. As they work, microworkers are timed and tracked with more and more efficiency and intense surveillance. Timers count down and algorithms rank their work in near real time. ‘1 minute left, 73 percent accurate’. If they take too long or lose focus, they’re instantly replaced by the next precarious worker waiting in line. Assembly line jobs at least come with coffee breaks and the possibility of unions. Here, it is impossible for workers to protest their conditions - they do not have the means to organise physically or otherwise (workers are temporary, software monitors everything they do and they can’t even supply bad data in protest).</p>
        <p className="content-block">
        In MICROREST, I pay workers to rest their mouse, and simply stop working. Workers place their mouse in the box located in the center of their screen, laying it to rest - and get paid as long as their mouse is inactive (and unproductive). The mouse no longer clicks, the microwork is paused, the AI training stops.
        </p>
        <p className="content-block">
        So far a total of {restData.count} workers have rested for{" "}
        {convertSeconds(restData.duration)}.
        </p>
        <p className="content-block" style={{textAlign: "left"}}>
        An international AI race is underway, advancing at a pace far beyond our ability to regulate it or fully grasp its consequences. In the face of this unstoppable force, MICROREST strives to make the smallest gesture of resistance against the AI machine. To support the project,  please{" "}
          <Link to={"/donate"} target="_blank" className="donation-link">
            <span className="donate-text">donate</span>
            <span className="donate-period">.</span>
          </Link>
          
        </p>
        <p className="content-block">
        *Microworkers or crowdworkers are anonymous online workers who perform discrete on-demand tasks that computers are currently unable to do as economically.
        </p>
        <p className="content-block">
        **Donations made will exclusively fund the economy of Tara Kelton’s Microrest project and not Fondazione MACTE
        </p>
        <p className="content-block"></p>
        <p className="content-block"></p>
        <p className="content-block"></p>
        <p className="content-block"></p>
      </div>
    </>
  );
}

export default HomeContent;
