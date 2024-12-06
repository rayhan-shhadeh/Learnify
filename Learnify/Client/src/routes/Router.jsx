import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* Layouts */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

// /* Pages */
// const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')));
const Home = Loadable(lazy(() => import('../views/Home'))); // Your Home page
const HomePage = Loadable(lazy(() => import('../views/HomePage'))); // Your Home page
// const Profile = Loadable(lazy(() => import('../views/Home'))); // Your Profile page
// const SignUp = Loadable(lazy(() => import('../views/authentication/SignUp')));
// const Login = Loadable(lazy(() => import('../views/authentication/Login')));
// const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')))
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')))
const Icons = Loadable(lazy(() => import('../views/icons/Icons')))
const TypographyPage = Loadable(lazy(() => import('../views/utilities/TypographyPage')))
const Shadow = Loadable(lazy(() => import('../views/utilities/Shadow')))
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
import Footer from '../layouts/full/header/Footer';
//import { Home } from '@mui/icons-material';

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/Home" /> },
      { path: '/Home', element: <Home /> },
      { path: '/Homepage', element: <HomePage /> },
      { path: '/dashboard', exact: true, element: <Dashboard /> },
      { path: '/sample-page', exact: true, element: <SamplePage /> },
      { path: '/icons', exact: true, element: <Icons /> },
      { path: '/ui/typography', exact: true, element: <TypographyPage /> },
      { path: '/ui/shadow', exact: true, element: <Shadow /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
