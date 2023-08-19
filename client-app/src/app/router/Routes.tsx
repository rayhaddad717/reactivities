import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestError";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import LoginForm from "../../features/users/LoginForm";
import ProfilePage from "../../features/profiles/ProfilePage";
import RequiredAuth from "./RequiredAuth";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequiredAuth />,
        children: [
          { path: "activities", element: <ActivityDashboard /> },
          { path: "activities/:id", element: <ActivityDetails /> },
          { path: "createActivity", element: <ActivityForm key="create" /> }, //i added a key so that the two component are
          { path: "manage/:id", element: <ActivityForm key="manage" /> }, // not the same and the state is not saved on page load
          { path: "profiles/:username", element: <ProfilePage /> }, // not the same and the state is not saved on page load
          { path: "errors", element: <TestErrors /> },
        ],
      },
      { path: "server-error", element: <ServerError /> },
      { path: "not-found", element: <NotFound /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
