import React, { useEffect, useState, useCallback } from "react";
import { getAllProperties, deleteProperty } from "../services/propertyService";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, AlertCircle, MapPinOff, Sparkles, RefreshCw, PlusCircle } from "lucide-react";
import PropertyCard from "../components/property/PropertyCard";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await deleteProperty(propertyId);
      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
    } catch (err) {
      alert(err?.message || "Delete failed");
    }
  };

  // 🔍 Get search query from URL
  const queryParams = new URLSearchParams(location.search);
  const searchLocation = queryParams.get("location") || "";

  // 🔥 Fetch Properties (with search filter)
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      // 🔥 Apply filter if search exists
      if (searchLocation) {
        params.location = searchLocation;
      }

      const res = await getAllProperties(params);

      setProperties(res?.properties || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  }, [searchLocation]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // 🔄 Loading UI
  if (loading) {
    return (
      <div style={styles.center}>
        <Loader2 size={40} strokeWidth={2} className="page-spinner" style={{ color: "var(--color-primary)" }} />
        <h3 style={styles.stateTitle}>Finding places for you…</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <div style={styles.stateIconWrap}>
          <AlertCircle size={48} strokeWidth={1.75} color="#e11d48" />
        </div>
        <h3 style={{ ...styles.stateTitle, color: "#b91c1c" }}>{error}</h3>
        <button type="button" className="btn btn-primary" style={styles.retryBtn} onClick={fetchProperties}>
          <RefreshCw size={18} style={{ marginRight: 8 }} />
          Retry
        </button>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div style={styles.center}>
        <div style={styles.stateIconWrap}>
          <MapPinOff size={48} strokeWidth={1.5} color="#717171" />
        </div>
        <h3 style={styles.stateTitle}>No properties found</h3>
        {searchLocation && (
          <p style={styles.muted}>Showing results for &quot;{searchLocation}&quot;</p>
        )}
        <button type="button" className="btn btn-primary" style={styles.ctaBtn} onClick={() => navigate("/add-property")}>
          <PlusCircle size={18} style={{ marginRight: 8 }} />
          Add Property
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        <Sparkles size={22} style={{ verticalAlign: "middle", marginRight: 8, color: "var(--color-primary)" }} />
        {searchLocation
          ? `Results for "${searchLocation}"`
          : "Explore Properties"}
      </h2>

      <div style={styles.grid}>
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            onClick={() => navigate(`/property/${property._id}`)}
            currentUserId={user?._id}
            onEdit={() => navigate(`/edit/${property._id}`)}
            onDelete={() => handleDelete(property._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;



// 🎨 Styles
const styles = {
  container: {
    padding: "20px",
    maxWidth: 1280,
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    marginBottom: "28px",
    fontSize: "1.5rem",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  center: {
    textAlign: "center",
    marginTop: "48px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  stateTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "var(--color-dark)",
  },
  stateIconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 88,
    height: 88,
    borderRadius: "50%",
    background: "linear-gradient(180deg, #f7f7f7 0%, #fff 100%)",
    border: "1px solid var(--color-border)",
    marginBottom: 8,
  },
  muted: {
    color: "var(--color-gray)",
    fontSize: 15,
  },
  retryBtn: {
    display: "inline-flex",
    alignItems: "center",
    marginTop: 8,
  },
  ctaBtn: {
    display: "inline-flex",
    alignItems: "center",
    marginTop: 8,
  },
};