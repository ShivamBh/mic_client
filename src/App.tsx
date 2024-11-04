import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Spaces from "@ably/spaces";
import { SpacesProvider, SpaceProvider } from "@ably/spaces/react";

const spaceName = "getSpace";

function App({ spaces }: { spaces: Spaces }) {
  const [count, setCount] = useState(0);

  return (
    <>
      <SpacesProvider client={spaces}>
        <SpaceProvider name={spaceName}>{/* <LiveCursors /> */}</SpaceProvider>
      </SpacesProvider>
    </>
  );
}

export default App;
