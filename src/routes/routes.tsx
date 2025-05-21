import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import JobPage from "../pages/JobPage";
import NotFoundPage from "../pages/NotFoundPage";
import AboutPage from "../pages/AboutPage";
import SchedulePage from "../pages/SchedulePage";
import MessagePage from "../pages/MessagePage";
import LoginPage from "../pages/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/job/:id",
    element: <JobPage />,
  },
  {
    path: "/jobs",
    element: <JobPage />,
  },
  {
    path: "/schedule",
    element: <SchedulePage />,
  },
  {
    path: "/message",
    element: <MessagePage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
