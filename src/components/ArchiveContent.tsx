import { Link } from "react-router-dom";
import "../styles/content.css";
import "../index.css";
import convertSeconds from "../utils/time-format";

function ArchiveContent({
  restData,
}: {
  restData: { count: number; duration: number };
}) {
  return (
    <>
      <div className="home-content">
        <h1 className="header-mobile">Microrest</h1>
        <p className="content-block">
          Behind much of contemporary society’s technological wonders, is
          microworkers*. Grinding along in remote isolation, they label images,
          moderate content and transcribe text – the secret engine behind the
          platforms and systems that make up every part of contemporary life.
          Microwork is hyper-efficient extraction of labour where eyes must be
          continuously fixed on the screen and wrists constantly moving. Jobs
          are cut up into their smallest parts, removing all context and meaning
          for workers.
        </p>
        <p className="content-block">
          Microwork is essential to training the same AI systems that will
          eventually render these workers obsolete. In microwork, not only is
          labour ceaseless, additional labour is stolen from the workers (they
          are not paid during training, their work is often formally rejected
          but still utilised and additional mouse tracking and eye tracking data
          is taken from them without any compensation).
        </p>
        <p className="content-block">
          Microwork is the ultimate realisation of labour extraction. As they
          work, microworkers are timed and tracked with more and more efficiency
          and intense surveillance. Timers count down and algorithms rank their
          work in near real time. ‘1 minute left, 73 percent accurate’. If they
          take too long or lose focus, they’re instantly replaced by the next
          precarious worker waiting in line. Assembly line work at least comes
          with coffee breaks and the ability to gather and unionise. Here, it is
          impossible for workers to protest their conditions - they do not have
          the means to organise physically or otherwise (workers are temporary,
          software monitors everything they do and they can’t even supply bad
          data in protest).
        </p>
        <p className="content-block">
          In MICROREST, I pay workers to rest their mouse, and simply stop
          working. Workers place their mouse in the box located in the center of
          their screen, laying it to rest - and get paid as long as their mouse
          is inactive (and unproductive). The mouse no longer clicks, the
          microwork is paused, the AI training stops.
        </p>

        <p className="content-block" style={{ textAlign: "left" }}>
          An international AI race is underway, advancing at a pace far beyond
          our ability to regulate it or to fully grasp its consequences. In the
          face of this unstoppable force, MICROREST strives to make the smallest
          gesture of resistance against the AI machine.
        </p>
        <p className="content-block">
          *Microworkers or crowdworkers are anonymous online workers who perform
          discrete on-demand tasks that computers are currently unable to do as
          economically.
        </p>
        <p className="content-block content-italic">
          MICROREST was live on this page from February 3rd to March 15th, 2025.
          Visitors could donate rest to the workers and view workers’ mouse
          cursors at rest in the box in the middle of the screen. This page is
          an archive of the rest that was donated to workers in that duration –
          a total of 117 workers rested for 8 hours 20 minutes and 41 seconds.
        </p>
        <p className="content-block"></p>
        <p className="content-block"></p>
        <p className="content-block"></p>
        <p className="content-block"></p>
      </div>
    </>
  );
}

export default ArchiveContent;
