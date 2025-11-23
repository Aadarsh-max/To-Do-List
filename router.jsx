import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./src/App";
import Login from "./src/pages/Login";
import SignUp from "./src/pages/SignUp";
import Profile from "./src/pages/Profile";
import CategoryPage from "./src/pages/CategoryPage";
import ProtectedRoute from "./src/components/ProtectedRoute";
import Settings from "./src/pages/Settings";
import Donate from "./src/pages/Donate";
import CalendarPage from "./src/pages/CalendarPage";
import TaskTemplateList from "./src/pages/TaskTemplateList";
import StarredTask from "./src/pages/StarredTask";
import PrivateTasks from "./src/pages/PrivateTasks";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "home",
        element: <Navigate to="/category/all" replace />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "donate",
        element: (
          <ProtectedRoute>
            <Donate />
          </ProtectedRoute>
        ),
      },

      {
        path: "calendar",
        element: (
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "tasktemplates",
        element: (
          <ProtectedRoute>
            <TaskTemplateList />
          </ProtectedRoute>
        ),
      },
      {
        path: "starredtask",
        element: (
          <ProtectedRoute>
            <StarredTask />
          </ProtectedRoute>
        ),
      },
      {
        path: "private-tasks",
        element: (
          <ProtectedRoute>
            <PrivateTasks />
          </ProtectedRoute>
        ),
      },
      // Dynamic Category Route
      {
        path: "category/:categoryName",
        element: (
          <ProtectedRoute>
            <CategoryPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
]);

export default router;
