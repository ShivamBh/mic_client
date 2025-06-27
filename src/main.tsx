import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Realtime } from "ably";
import { nanoid } from "nanoid";
import Spaces from "@ably/spaces";
import { AblyProvider } from "ably/react";

import {
  SpaceProvider,
  SpacesProvider,
} from "@ably/spaces/dist/mjs/react/index";
import ArchiveHome from "./components/ArchiveHome.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: ArchiveHome,
  },
]);

const client = new Realtime({
  clientId: nanoid(),
  key: import.meta.env.VITE_ABLY_KEY,
});

const spaces = new Spaces(client);
const spaceName = "resting-area";

createRoot(document.getElementById("root")!).render(
  <AblyProvider client={client}>
    <SpacesProvider client={spaces}>
      <SpaceProvider
        name={spaceName}
        options={{
          offlineTimeout: 10000,
        }}
      >
        <RouterProvider router={router} />
      </SpaceProvider>
    </SpacesProvider>
  </AblyProvider>
);
