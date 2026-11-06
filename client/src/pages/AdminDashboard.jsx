import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProperties, deleteProperty } from "../services/propertyService";
import { getPropertyBookings } from "../services/bookingService";
import {
  LayoutDashboard,
  PlusCircle,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
  CalendarRange,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);
  const [bookingsByProperty, setBookingsByProperty] = useState({});
  const [busyId, setBusyId] = useState(null);

  const fetchMy = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyProperties();
      setProperties(res?.properties || []);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMy();
  }, []);

  const fmt = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const toggleBookings = async (propertyId) => {
    if (openId === propertyId) {
      setOpenId(null);
      return;
    }
    setOpenId(propertyId);
    if (bookingsByProperty[propertyId]) return;
    try {
      const res = await getPropertyBookings(propertyId);
      setBookingsByProperty((prev) => ({ ...prev, [propertyId]: res?.bookings || [] }));
    } catch (err) {
      alert(err?.message || "Failed to load bookings");
    }
  };

  const onDelete = async (propertyId) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      setBusyId(propertyId);
      await deleteProperty(propertyId);
      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      setOpenId((prev) => (prev === propertyId ? null : prev));
    } catch (err) {
      alert(err?.message || "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const stats = useMemo(() => {
    const total = properties.length;
    return { total };
  }, [properties.length]);

  if (loading) {
    return (
      <div style={styles.center}>
        <Loader2 size={40} strokeWidth={2} className="page-spinner" style={{ color: "var(--color-primary)" }} />
        <h3 style={styles.stateTitle}>Loading admin dashboard…</h3>
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
        <button type="button" className="btn btn-primary" onClick={fetchMy}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div style={styles.headerLeft}>
          <LayoutDashboard size={32} strokeWidth={1.75} color="var(--color-primary)" />
          <div>
            <h2 style={styles.pageTitle}>Admin Dashboard</h2>
            <p style={styles.subTitle}>{stats.total} properties</p>
          </div>
        </div>

        <button type="button" className="btn btn-primary" style={styles.addBtn} onClick={() => navigate("/add-property")}>
          <PlusCircle size={18} style={{ marginRight: 8 }} />
          Add Property
        </button>
      </div>

      {properties.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>No properties yet</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate("/add-property")}>
            Add your first property
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {properties.map((p) => {
            const isOpen = openId === p._id;
            const bookings = bookingsByProperty[p._id] || null;
            return (
              <div key={p._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div style={styles.thumbWrap}>
                    <img
                      src={p.images?.[0] || "https://via.placeholder.com/300"}
                      alt={p.title}
                      style={styles.thumb}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={styles.cardTitle}>{p.title}</h3>
                    <p style={styles.cardMeta}>{p.location}</p>
                    <p style={styles.cardMeta}>₹ {p.price} / night</p>
                  </div>

                  <div style={styles.actions}>
                    <button type="button" style={styles.iconBtn} onClick={() => navigate(`/edit/${p._id}`)} title="Edit">
                      <Pencil size={18} />
                    </button>
                    <button
                      type="button"
                      style={{ ...styles.iconBtn, color: "#b91c1c" }}
                      onClick={() => onDelete(p._id)}
                      disabled={busyId === p._id}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <button type="button" style={styles.bookingsToggle} onClick={() => toggleBookings(p._id)}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <CalendarRange size={18} />
                    View bookings
                  </span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {isOpen && (
                  <div style={styles.bookingsBox}>
                    {!bookings ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--color-gray)" }}>
                        <Loader2 size={18} className="page-spinner" />
                        Loading bookings…
                      </div>
                    ) : bookings.length === 0 ? (
                      <p style={{ color: "var(--color-gray)", margin: 0 }}>No bookings for this property.</p>
                    ) : (
                      <div style={styles.bookingsList}>
                        {bookings.map((b) => (
                          <div key={b._id} style={styles.bookingRow}>
                            <div style={{ minWidth: 0 }}>
                              <div style={styles.bookingTitle}>{b.user?.name || b.user?.email || "Guest"}</div>
                              <div style={styles.bookingSub}>
                                {fmt(b.startDate)} → {fmt(b.endDate)}
                              </div>
                            </div>
                            <div style={styles.bookingStatus}>{String(b.status || "").toUpperCase()}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

const styles = {
  container: {
    padding: "24px",
    maxWidth: 1200,
    margin: "0 auto",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 22,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  pageTitle: {
    fontSize: "1.75rem",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    margin: 0,
  },
  subTitle: {
    margin: "4px 0 0",
    color: "var(--color-gray)",
    fontWeight: 500,
  },
  addBtn: {
    display: "inline-flex",
    alignItems: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 18,
  },
  card: {
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 18,
    boxShadow: "0 10px 26px rgba(0,0,0,0.07)",
    overflow: "hidden",
  },
  cardTop: {
    display: "flex",
    gap: 14,
    padding: 16,
    alignItems: "flex-start",
  },
  thumbWrap: {
    width: 92,
    height: 76,
    borderRadius: 14,
    overflow: "hidden",
    flexShrink: 0,
    border: "1px solid rgba(0,0,0,0.08)",
  },
  thumb: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.05rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardMeta: {
    margin: "6px 0 0",
    color: "var(--color-gray)",
    fontSize: 14,
  },
  actions: {
    display: "flex",
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(0,0,0,0.02)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  bookingsToggle: {
    width: "100%",
    padding: "12px 16px",
    borderTop: "1px solid rgba(0,0,0,0.06)",
    background: "linear-gradient(180deg, rgba(247,247,247,0.75) 0%, rgba(255,255,255,1) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontWeight: 700,
    color: "var(--color-dark)",
  },
  bookingsBox: {
    padding: 14,
    borderTop: "1px solid rgba(0,0,0,0.06)",
  },
  bookingsList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  bookingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.06)",
    background: "rgba(0,0,0,0.015)",
  },
  bookingTitle: {
    fontWeight: 700,
    fontSize: 14,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  bookingSub: {
    color: "var(--color-gray)",
    fontSize: 13,
    marginTop: 2,
  },
  bookingStatus: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.06em",
    color: "var(--color-gray)",
  },
  empty: {
    textAlign: "center",
    padding: "48px 24px",
    background: "#fff",
    borderRadius: 16,
    border: "1px dashed var(--color-border)",
  },
  emptyText: {
    fontSize: "1.15rem",
    fontWeight: 700,
    marginBottom: 14,
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
  },
};

