import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// import App from "./App.tsx";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import MuseumHome from './components/MuseumHome.tsx';
// import WorkersHome from "./components/WorkersHome.tsx";
import { Realtime } from 'ably';
import { nanoid } from 'nanoid';
import Spaces from '@ably/spaces';
import { AblyProvider } from 'ably/react';
import App from './App.tsx';
import DonatePage from './components/DonateHome.tsx';
import PaymentSuccess from './components/PaymentSuccess.tsx';
import { SpaceProvider, SpacesProvider } from '@ably/spaces/dist/mjs/react/index';
import ArchiveHome from './components/ArchiveHome.tsx';
import MuseumHomeMobile from './components/MuseumHomeMobile.tsx';
import { useMediaQuery } from 'react-responsive';

function HomeRoute() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return isMobile ? <MuseumHomeMobile /> : <MuseumHome />;
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: HomeRoute,
  },
  {
    path: '/donate',
    Component: DonatePage,
  },
  {
    path: '/donate/success',
    Component: PaymentSuccess,
  },
  {
    path: '/archive',
    Component: ArchiveHome,
  },
  {
    path: '/mob-test',
    Component: MuseumHomeMobile,
  },
]);

const client = new Realtime({
  clientId: nanoid(),
  key: import.meta.env.VITE_ABLY_KEY,
});

const spaces = new Spaces(client);
const spaceName = 'resting-area';

createRoot(document.getElementById('root')!).render(
  <AblyProvider client={client}>
    <SpacesProvider client={spaces}>
      <SpaceProvider
        name={spaceName}
        options={{
          offlineTimeout: 10000,
        }}
      >
        <RouterProvider router={router} />
        {/*  <App >  */}
      </SpaceProvider>
    </SpacesProvider>
  </AblyProvider>
);
