import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes } from './types/routes';

const Home = lazy(() => import('./pages/home'));
const Play = lazy(() => import('./pages/play'));
const Won = lazy(() => import('./pages/won'));

const router = createBrowserRouter([
  {
    path: Routes.Home,
    element: <Home />,
  },
  {
    path: Routes.Play,
    element: <Play />,
  },
  {
    path: Routes.Won,
    element: <Won />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer position='bottom-right' theme='colored' hideProgressBar />
  </React.StrictMode>
);
