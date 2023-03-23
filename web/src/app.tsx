import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/home';
import Play from './pages/play';
import Won from './pages/won';
import './styles/global.css';
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
  {
    path: Routes.Won,
    element: <Won />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer
      transition={Slide}
      position='bottom-right'
      theme='colored'
      hideProgressBar
    />
  </React.StrictMode>
);
