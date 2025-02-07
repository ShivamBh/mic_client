import "./App.css";
import Spaces from "@ably/spaces";
import { SpacesProvider, SpaceProvider, useCursors } from "@ably/spaces/react";

const spaceName = "resting-area";

function App() {
  const {cursors} = useCursors({returnCursors: true})
  console.log("from home", cursors)
  return (
    <>
      <div>main</div>
    </>
  );
}

export default App;
