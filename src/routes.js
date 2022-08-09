import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
//
import Blog from "./pages/Blog";
import AddRole from "./pages/AddRole";
import Login from "./pages/Login";
import NotFound from "./pages/Page404";
import Register from "./pages/Register";
import Products from "./pages/Products";
import DashboardApp from "./pages/DashboardApp";
import EditRole from "./pages/EditRole";
import RoleManager from "./pages/RoleManager";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { path: "app", element: <DashboardApp /> },
        { path: "roleManager", element: <RoleManager /> },
        { path: "addRole", element: <AddRole /> },
        { path: "editRole", element: <EditRole /> },
        { path: "products", element: <Products /> },
        { path: "blog", element: <Blog /> },
      ],
    },
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        { path: "/", element: <Navigate to="/dashboard/app" /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "404", element: <NotFound /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
