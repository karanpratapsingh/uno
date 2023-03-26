import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RootErrorBoundary from './components/errors/root';
import Home from './pages/home';
import Play from './pages/play';
import Won from './pages/won';
import './styles/global.css';
import { Routes } from './types/routes';

const router = createBrowserRouter([
  {
    path: Routes.Home,
    element: <Home />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: Routes.Play,
    element: <Play />,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: Routes.Won,
    element: <Won />,
    errorElement: <RootErrorBoundary />,
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
