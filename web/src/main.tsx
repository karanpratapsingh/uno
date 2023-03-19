import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Play from './pages/play';
import Home from './pages/home';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Routes } from './types/routes';

const router = createBrowserRouter([
  {
    path: Routes.Home,
    element: <Home />,
  },
  {
    path: Routes.Play,
    element: <Play />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
