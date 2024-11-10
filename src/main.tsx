import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MuseumHome from "./components/MuseumHome.tsx";
// import WorkersHome from "./components/WorkersHome.tsx";
import { Realtime } from "ably";
import { nanoid } from "nanoid";
import Spaces from "@ably/spaces";
import { AblyProvider } from "ably/react";
import App from "./App.tsx";
import DonatePage from "./components/Donate.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MuseumHome,
  },
  {
    path: "/donate",
    Component: DonatePage,
  },
]);

const client = new Realtime({
  clientId: nanoid(),
  key: import.meta.env.VITE_ABLY_KEY,
});

const spaces = new Spaces(client);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AblyProvider client={client}>
      <App spaces={spaces} />
    </AblyProvider>
    <RouterProvider router={router} />
  </StrictMode>
);
