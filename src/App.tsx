import "./App.css";
import Spaces from "@ably/spaces";
import { SpacesProvider, SpaceProvider } from "@ably/spaces/react";

const spaceName = "getSpace";

function App({ spaces }: { spaces: Spaces }) {
  return (
    <>
      <SpacesProvider client={spaces}>
        <SpaceProvider name={spaceName}>{/* <LiveCursors /> */}</SpaceProvider>
      </SpacesProvider>
    </>
  );
}

export default App;
