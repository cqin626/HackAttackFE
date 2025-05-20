import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import JobPage from "../pages/JobPage";
import NotFoundPage from "../pages/NotFoundPage";
import AboutPage from "../pages/AboutPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/job/:id",
    element: <JobPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/jobs",  // <-- Add this route for general JobPage
    element: <JobPage />,
  },
]);

export default router;
