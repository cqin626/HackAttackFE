import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import JobPage from "../pages/JobPage";
import NotFoundPage from "../pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/job/:id",
    element: <JobPage />,
    errorElement: <NotFoundPage />,
  }

]);

export default router;
