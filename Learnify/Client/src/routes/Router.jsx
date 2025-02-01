import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

import CoursesPage from '../views/CoursesPage';
import Main from "../layouts/Main";
import Home from "../views/Home";
import Calender from "../views/Calender";
import CourseFilesPage from "../views/CourseFilesPage"
//import App from '../Components/fileComponents/file-study'
import FileStudyPage from '../views/fileStudyPage';
import FilePracticePage from '../views/filePracticePage'
import QuizPage from '../views/QuizPage'
import ExplorePage from '../views/ExplorePage';
import ExploreFlashcardsPage from '../views/ExploreFlashcardsPage';
import {
  Dashboard,
  Team,
  Invoices,
  Contacts,
  Form,
  Bar,
  Line,
  Pie,
  FAQ,
  Calendar,
  Stream,
} from "../scenes";
//import PDFViewer from '../Components/fileComponents/PdfTest';
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

//const Home = Loadable(lazy(() => import('../views/Home'))); // Your Home page
const HomePage = Loadable(lazy(() => import('../views/HomePage'))); // Your Home page

const Dashboard1 = Loadable(lazy(() => import('../views/dashboard/Dashboard')))
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')))
const Icons = Loadable(lazy(() => import('../views/icons/Icons')))
const TypographyPage = Loadable(lazy(() => import('../views/utilities/TypographyPage')))
const Shadow = Loadable(lazy(() => import('../views/utilities/Shadow')))
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const HabitTracker = Loadable(lazy(() => import('../scenes/HabitTracker')));
const Chatting = Loadable(lazy(() => import('../scenes/Chatting/Chatting')));
const GroupsScreen = Loadable(lazy(() => import('../scenes/Chatting/GroupsScreen')));
const UpdatePassword = Loadable(lazy(() => import('../views/authentication/auth/UpdatePassword')));

const Router = [
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/logout', element: <Login /> },
      { path: '/auth/forgotpassword', element: <UpdatePassword /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/calendar",
        element: <Calender></Calender>,
      }   
    ]
  },{
    path: '/',
    element: <FullLayout></FullLayout>,
    children: [
    { path: '/dashboard', exact: true, element: <Dashboard1 /> }
    ]
  },{
    path: '/courses',
    element: <CoursesPage></CoursesPage>,
  },
  {
    path: '/files',
    element: <CourseFilesPage></CourseFilesPage>,
  },
  {
    path: '/files/fileStudy',
    element: <FileStudyPage></FileStudyPage>,
  },
  {
    path: '/files/fileQuiz',
    element: <QuizPage></QuizPage>,
  },
  {
    path: '/files/filePractice',
    element: <FilePracticePage></FilePracticePage>,
  },
  {
    path: '/explore',
    element: <ExplorePage></ExplorePage>,
  },
  {
    path: '/explore/exploreFlashcards',
    element: <ExploreFlashcardsPage></ExploreFlashcardsPage>,
  },
  {
    path: "/dash",
    element: <Dashboard />,
    children: [
      {
        path: "/dash/home",
        element: <Dashboard />,
      },
      {
        path: "/dash/calendar",
        element: <Calendar />,
      },
      {
        path: "/dash/contacts",
        element: <Contacts />,
      },
      {
        path: "/dash/team",
        element: <Team />,
      },
      {
        path: "/dash/invoices",
        element: <Invoices />,
      },
      {
        path: "/dash/form",
        element: <Form />,
      },
      {
        path: "/dash/bar",
        element: <Bar />,
      },
      {
        path: "/dash/pie",
        element: <Pie />,
      },
      {
        path: "/dash/stream",
        element: <Stream />,
      },
      {
        path: "/dash/line",
        element: <Line />,
      },
      {
        path: "/dash/faq",
        element: <FAQ />,
      },
    ],
  }
    ,{
      path: "/habits",
      element: <HabitTracker />,
      children: [
        {
          path: "/habits/track",
          element: <Dashboard />,
        },
      ],
    },
    {
      path: "/chatting",
        element: <Chatting />,
        children: [
          {
            path: "/chatting/chat",
            element: <Chatting />,
          },      {
            path: "/chatting/groups",
            element: <GroupsScreen />,
          },
    
        ],
      },  {
        path: "/groups",
          element: <GroupsScreen />,
          children: [
            {
              path: "/groups/chat",
              element: <Chatting />,
            }, 
      
          ],
        },
  ];
  
  export default Router;
  
