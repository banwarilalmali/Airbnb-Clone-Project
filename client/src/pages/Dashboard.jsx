import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, LayoutDashboard, Loader2, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { deleteProperty, getAllProperties, getMyProperties } from "../services/propertyService";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const isAdmin = (user?.role || "user") === "admin";
      const res = isAdmin ? await getAllProperties() : await getMyProperties();
      setProperties(res?.properties || []);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      navigate("/login");
      return;
    }
    fetchProperties();
  }, [authLoading, user, navigate, fetchProperties]);

  const isAdmin = (user?.role || "user") === "admin";

  const canManage = (property) => {
    if (isAdmin) return true;
    const ownerId = property?.owner?._id || property?.user?._id || property?.user;
    return ownerId && String(ownerId) === String(user?._id);
  };

  const onDelete = async (propertyId) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      setBusyId(propertyId);
      await deleteProperty(propertyId);
      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
    } catch (err) {
      alert(err?.message || "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const heading = useMemo(
    () => ((user?.role || "user") === "admin" ? "Admin Dashboard" : "My Dashboard"),
    [user?.role]
  );

  if (loading) {
    return (
      <div style={styles.center}>
        <Loader2 size={40} strokeWidth={2} className="page-spinner" style={{ color: "var(--color-primary)" }} />
        <h3 style={styles.stateTitle}>Loading dashboard…</h3>
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
        <button type="button" className="btn btn-primary" onClick={fetchProperties}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div style={styles.headerLeft}>
          <LayoutDashboard size={30} strokeWidth={1.75} color="var(--color-primary)" />
          <div>
            <h2 style={styles.pageTitle}>{heading}</h2>
            <p style={styles.subTitle}>{properties.length} properties</p>
          </div>
        </div>
        <button type="button" className="btn btn-primary" style={styles.addBtn} onClick={() => navigate("/add-property")}>
          <PlusCircle size={18} style={{ marginRight: 8 }} />
          Add Property
        </button>
      </div>

      {properties.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>No properties found.</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate("/add-property")}>
            Add Property
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {properties.map((property) => {
            const owner = property?.owner || property?.user;
            const ownerName = owner?.name || "Unknown";
            return (
              <div key={property._id} style={styles.card}>
                <img
                  src={property.images?.[0] || "https://via.placeholder.com/300"}
                  alt={property.title}
                  style={styles.image}
                />
                <h3 style={styles.title}>{property.title}</h3>
                <p style={styles.meta}>{property.location}</p>
                <p style={styles.price}>₹ {property.price} / night</p>
                <p style={styles.ownerTag}>Added by: {ownerName}</p>

                <div style={styles.actions}>
                  <button type="button" style={styles.actionBtn} onClick={() => navigate(`/property/${property._id}`)}>
                    View
                  </button>
                  {canManage(property) && (
                    <>
                      <button type="button" style={styles.actionBtn} onClick={() => navigate(`/edit/${property._id}`)}>
                        <Pencil size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                        onClick={() => onDelete(property._id)}
                        disabled={busyId === property._id}
                      >
                        <Trash2 size={16} />
                        <span>{busyId === property._id ? "Deleting…" : "Delete"}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

const styles = {
  container: { padding: "24px", maxWidth: 1200, margin: "0 auto" },
  headerRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 22 },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  pageTitle: { margin: 0, fontSize: "1.65rem", fontWeight: 800, letterSpacing: "-0.02em" },
  subTitle: { margin: "4px 0 0", color: "var(--color-gray)" },
  addBtn: { display: "inline-flex", alignItems: "center" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 },
  card: { background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 16, padding: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" },
  image: { width: "100%", height: 180, objectFit: "cover", borderRadius: 12, marginBottom: 10 },
  title: { margin: 0, fontSize: "1.05rem", fontWeight: 700 },
  meta: { margin: "4px 0 0", color: "var(--color-gray)" },
  price: { margin: "6px 0 0", fontWeight: 700 },
  ownerTag: { margin: "8px 0 0", fontSize: 13, color: "#6b7280", fontWeight: 600 },
  actions: { marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" },
  actionBtn: { display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 10, background: "#fff", padding: "8px 10px", fontWeight: 600 },
  deleteBtn: { color: "#b91c1c", borderColor: "rgba(185,28,28,0.2)" },
  center: { textAlign: "center", marginTop: "48px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 },
  stateTitle: { fontSize: "1.25rem", fontWeight: 600, color: "var(--color-dark)" },
  stateIconWrap: { display: "flex", alignItems: "center", justifyContent: "center", width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(180deg, #f7f7f7 0%, #fff 100%)", border: "1px solid var(--color-border)" },
  empty: { textAlign: "center", padding: "48px 24px", background: "#fff", borderRadius: 16, border: "1px dashed var(--color-border)" },
  emptyText: { fontSize: "1.1rem", fontWeight: 700, marginBottom: 12 },
};