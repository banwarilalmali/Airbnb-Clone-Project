import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const PropertyDetails = lazy(() => import("../pages/PropertyDetails"));
const AddProperty = lazy(() => import("../pages/AddProperty"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Bookings = lazy(() => import("../pages/Bookings"));
const EditProperty = lazy(() => import("../pages/EditProperty"));

const Loader = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h3>Loading...</h3>
  </div>
);

const ProtectedRoute = () => {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

const PublicRoute = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <Loader />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route path="/" element={<Home />} />
        <Route path="/property/:id" element={<PropertyDetails />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/edit/:id" element={<EditProperty />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
