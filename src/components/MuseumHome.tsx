import "../museum.css";
import HomeUI from "./HomeUI";
import HomeContent from "./HomeContent";

function MuseumHome() {
  // const getCursors = useCursors

  return (
    <>
      <div className="home-container">
        <HomeUI />
        <HomeContent />
      </div>
    </>
  );
}

export default MuseumHome;
