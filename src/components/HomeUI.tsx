import "../styles/ui.css";

function HomeUI() {
  return (
    <>
      <div className="ui-container">
        <div className="ui-header">
          <h1 className="header-text">MICROREST</h1>
        </div>
        <div className="ui-window">
          <div className="cursor-window"></div>
        </div>
        <div className="ui-footer">
          <p className="worker-stats">3 workers resting</p>
        </div>
      </div>
    </>
  );
}

export default HomeUI;
