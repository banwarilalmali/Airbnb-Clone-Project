import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  House,
  CircleUser,
  LogOut,
  PlusCircle,
  LayoutDashboard,
  CalendarDays,
  LogIn,
  UserPlus,
  Loader2,
} from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout, loading } = useAuthContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?location=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const showAuthed = !loading && !!user;
  const role = user?.role || "user";
  const isAdmin = role === "admin";

  return (
    <nav className="navbar-shell">
      <div className="navbar-inner">
        <div className="nav-left">
          <div
            className="nav-brand"
            onClick={() => navigate("/")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate("/")}
          >
            <div className="nav-brand-icon" aria-hidden>
              <Home size={22} strokeWidth={2.25} color="#fff" />
            </div>
            <span className="nav-brand-text">airbnb</span>
          </div>
          <Link to="/" className="nav-link-pill">
            <House size={18} strokeWidth={2} />
            <span>Home</span>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="nav-search-form">
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search destinations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search by location"
          />
          <button type="submit" className="nav-search-submit" aria-label="Search">
            <Search size={18} strokeWidth={2.5} />
          </button>
        </form>

        <div className="nav-actions">
          {loading ? (
            <span className="nav-loading">
              <Loader2 size={22} className="nav-spinner" strokeWidth={2} />
            </span>
          ) : showAuthed ? (
            <>
              {isAdmin ? (
                <>
                  <Link to="/add-property" className="nav-link-pill">
                    <PlusCircle size={18} strokeWidth={2} />
                    <span>Add Property</span>
                  </Link>
                  <Link to="/dashboard" className="nav-link-pill">
                    <LayoutDashboard size={18} strokeWidth={2} />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/bookings" className="nav-link-pill">
                    <CalendarDays size={18} strokeWidth={2} />
                    <span>Bookings</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="nav-link-pill">
                    <LayoutDashboard size={18} strokeWidth={2} />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/bookings" className="nav-link-pill">
                    <CalendarDays size={18} strokeWidth={2} />
                    <span>Bookings</span>
                  </Link>
                </>
              )}
              <div className="nav-user-chip">
                <CircleUser size={20} strokeWidth={2} className="nav-user-icon" />
                <span className="nav-user-name">{user?.name || user?.email || "User"}</span>
              </div>
              <button type="button" onClick={handleLogout} className="nav-btn-logout">
                <LogOut size={18} strokeWidth={2} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link-pill">
                <LogIn size={18} strokeWidth={2} />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="nav-btn-signup">
                <UserPlus size={18} strokeWidth={2} />
                <span>Signup</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
