import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

// Global Context
import { AuthProvider } from "./context/AuthContext";

// Common Components
import Loader from "./components/common/Loader";
import Navbar from "./components/common/Navbar";

// Global Styles (optional future use)
// import "./App.css";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* Global Navbar */}
        <Navbar />

        {/* Lazy Loading Wrapper */}
        <Suspense fallback={<Loader />}>
          <AppRoutes />
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;  
