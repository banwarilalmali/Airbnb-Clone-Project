import React, { useEffect, useMemo, useState } from "react";
import { getUserBookings, cancelBooking } from "../services/bookingService";
import { CalendarDays, Loader2, AlertCircle, CalendarRange, Tag, IndianRupee, XCircle } from "lucide-react";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getUserBookings();
      setBookings(res?.bookings || []);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const badge = useMemo(
    () => (status) => {
      switch (status) {
        case "confirmed":
          return { color: "#15803d", background: "#dcfce7" };
        case "cancelled":
          return { color: "#b91c1c", background: "#fee2e2" };
        case "pending":
          return { color: "#c2410c", background: "#ffedd5" };
        default:
          return { color: "#525252", background: "#f5f5f5" };
      }
    },
    []
  );

  const onCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      setBusyId(id);
      await cancelBooking(id);
      await fetchBookings();
    } catch (err) {
      alert(err?.message || "Cancel failed");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <Loader2 size={40} strokeWidth={2} className="page-spinner" style={{ color: "var(--color-primary)" }} />
        <h3 style={styles.stateTitle}>Loading your dashboard…</h3>
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
        <button type="button" className="btn btn-primary" onClick={fetchBookings}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <CalendarDays size={32} strokeWidth={1.75} color="var(--color-primary)" />
        <h2 style={styles.pageTitle}>Your Dashboard</h2>
      </div>

      {bookings.length === 0 ? (
        <div style={styles.empty}>
          <CalendarRange size={56} strokeWidth={1.25} color="#a3a3a3" />
          <p style={styles.emptyText}>No bookings yet</p>
          <p style={styles.emptyHint}>When you reserve a stay, it will show up here.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {bookings.map((b) => (
            <div key={b._id} style={styles.card}>
              <h3 style={styles.cardTitle}>{b.property?.title || "Property"}</h3>

              <p style={styles.row}>
                <CalendarRange size={18} strokeWidth={2} style={{ opacity: 0.7, flexShrink: 0 }} />
                <span>
                  {formatDate(b.startDate)} → {formatDate(b.endDate)}
                </span>
              </p>

              <p style={styles.row}>
                <IndianRupee size={18} strokeWidth={2} style={{ opacity: 0.7, flexShrink: 0 }} />
                <span style={{ fontWeight: 600 }}>{b.totalPrice}</span>
              </p>

              <p style={styles.statusRow}>
                <Tag size={16} strokeWidth={2} style={{ opacity: 0.6 }} />
                <span style={{ ...styles.badge, ...badge(b.status) }}>{b.status?.toUpperCase()}</span>
              </p>

              {b.status !== "cancelled" && (
                <button
                  type="button"
                  onClick={() => onCancel(b._id)}
                  style={styles.cancelBtn}
                  disabled={busyId === b._id}
                >
                  <XCircle size={18} strokeWidth={2} />
                  <span>{busyId === b._id ? "Cancelling…" : "Cancel booking"}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

const styles = {
  container: {
    padding: "24px",
    maxWidth: 1100,
    margin: "0 auto",
  },
  pageHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 28,
  },
  pageTitle: {
    fontSize: "1.75rem",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.04)",
  },
  cardTitle: {
    margin: "0 0 14px",
    fontSize: "1.1rem",
    fontWeight: 600,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "10px 0",
    fontSize: 14,
    color: "#404040",
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  badge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.04em",
  },
  cancelBtn: {
    marginTop: 16,
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    background: "linear-gradient(145deg, #ef4444 0%, #dc2626 100%)",
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    boxShadow: "0 4px 12px rgba(220, 38, 38, 0.25)",
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
  empty: {
    textAlign: "center",
    padding: "48px 24px",
    background: "#fff",
    borderRadius: 16,
    border: "1px dashed var(--color-border)",
  },
  emptyText: {
    marginTop: 16,
    fontSize: "1.15rem",
    fontWeight: 600,
    color: "var(--color-dark)",
  },
  emptyHint: {
    marginTop: 8,
    color: "var(--color-gray)",
    fontSize: 15,
  },
};

