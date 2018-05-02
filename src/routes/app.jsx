import DashboardPage from "../views/Dashboard/Dashboard.jsx";

import Typography from "../views/Typography/Typography.jsx";


import {
  Dashboard,
  LibraryBooks
 } from "material-ui-icons";

const appRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Material Dashboard",
    icon: Dashboard,
    component: DashboardPage
  },

  {
    path: "/edit_app",
    sidebarName: "Edit App",
    navbarName: "Edit App",
    icon: LibraryBooks,
    component: Typography
  },

  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default appRoutes;
