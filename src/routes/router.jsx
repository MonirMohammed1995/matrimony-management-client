import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "../routes/PrivateRoute";

// Layouts
import MainLayouts from "../layouts/MainLayouts";

// Public Pages
import Home from "../pages/Home/Home";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import ErrorPage from "../pages/Error/ErrorPage";

// Admin Dashboard Pages
import DashboardOverview from "../pages/Dashboard/Admin/DashboardOverview";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ApprovePremium from "../pages/Dashboard/Admin/ApprovePremium";
import ApproveContact from "../pages/Dashboard/Admin/ApproveContact";

// User Dashboard Pages
import EditBiodata from "../pages/Dashboard/User/EditBiodata";
import ViewBiodata from "../pages/Dashboard/User/ViewBiodata";
import MyFavourites from "../pages/Dashboard/User/MyFavourites";
import GotMarried from "../pages/Dashboard/User/GotMarried";
import MyContactRequests from "../pages/Dashboard/User/MyContactRequests";

import About from "../pages/About/About";
import Services from "../pages/Services/Services";
import Biodatas from "../pages/Biodatas/Biodatas";
import ContactUs from "../pages/ContactUs/ContactUs";
import DashboardLayout from "../layouts/DashboardLayout";
import PieChartAnalytics from "../pages/Dashboard/Admin/PieChartAnalytics";
import SuccessStories from "../pages/Dashboard/Admin/SuccessStories";
import AddBioData from "../pages/Dashboard/User/AddBioData";

// ===========================
// Router Configuration
// ===========================
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayouts />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/about", element: <About /> },
      { path: "/services", element: <Services /> },
      { path: "/biodatas", element: <Biodatas /> },
      { path: "/contact-us", element: <ContactUs /> },
    ],
  },

  // Admin Dashboard Routes
  {
    path: "/dashboard/admin",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: "/dashboard/admin/overview", element: <DashboardOverview /> },
      { path: "/dashboard/admin/manage-users", element: <ManageUsers /> },
      { path: "/dashboard/admin/approved-premium", element: <ApprovePremium /> },
      { path: "/dashboard/admin/approved-contacts", element: <ApproveContact /> },
      { path: "/dashboard/admin/piechart-analytics", element: <PieChartAnalytics/> },
      { path: "/dashboard/admin/success-stories", element: <SuccessStories/> },
    ],
  },

  // User Dashboard Routes
  {
    path: "/dashboard/user",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: "Add-biodata", element: <AddBioData/> },
      { path: "edit-biodata", element: <EditBiodata /> },
      { path: "view-biodata", element: <ViewBiodata /> },
      { path: "my-favourites", element: <MyFavourites /> },
      { path: "contact-requests", element: <MyContactRequests /> },
      { path: "got-married", element: <GotMarried /> },
    ],
  },
]);