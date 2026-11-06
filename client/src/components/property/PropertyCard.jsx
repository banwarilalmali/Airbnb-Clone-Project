import React from "react";
import { Heart, Star, Users, BedDouble, Pencil, Trash2 } from "lucide-react";

const PropertyCard = ({ property, onClick, currentUserId, onEdit, onDelete }) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  const ownerId = property?.user?._id || property?.user;
  const isOwner = ownerId && currentUserId && String(ownerId) === String(currentUserId);

  return (
    <div
      className="property-card-lift"
      style={styles.card}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div style={styles.imageWrapper}>
        <img
          src={property.images?.[0] || "https://via.placeholder.com/300"}
          alt={property.title}
          style={styles.image}
        />

        <button
          type="button"
          style={styles.heartBtn}
          onClick={handleFavoriteClick}
          aria-label="Save to favorites"
        >
          <Heart size={18} strokeWidth={2} color="#222" />
        </button>

        {isOwner && (
          <button
            type="button"
            style={styles.editBtn}
            onClick={handleEditClick}
            aria-label="Edit property"
            title="Edit"
          >
            <Pencil size={16} strokeWidth={2} color="#222" />
          </button>
        )}

        {isOwner && (
          <button
            type="button"
            style={styles.deleteBtn}
            onClick={handleDeleteClick}
            aria-label="Delete property"
            title="Delete"
          >
            <Trash2 size={16} strokeWidth={2} color="#b91c1c" />
          </button>
        )}
      </div>

      <div style={styles.info}>
        <div style={styles.topRow}>
          <h4 style={styles.title}>{property.title}</h4>
          <span style={styles.rating}>
            <Star
              size={15}
              fill="#222"
              color="#222"
              strokeWidth={0}
              style={{ verticalAlign: "middle", marginRight: 4 }}
            />
            4.5
          </span>
        </div>

        <p style={styles.location}>{property.location}</p>

        <p style={styles.meta}>
          <span style={styles.metaItem}>
            <Users size={14} strokeWidth={2} style={{ opacity: 0.65 }} />
            {property.guests || 1} guests
          </span>
          <span style={styles.metaDot}>·</span>
          <span style={styles.metaItem}>
            <BedDouble size={14} strokeWidth={2} style={{ opacity: 0.65 }} />
            {property.bedrooms || 1} beds
          </span>
        </p>

        <p style={styles.price}>
          ₹ {property.price} <span style={styles.perNight}>/ night</span>
        </p>
      </div>
    </div>
  );
};

export default PropertyCard;

const styles = {
  card: {
    borderRadius: "14px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  imageWrapper: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: "260px",
    objectFit: "cover",
    borderRadius: "14px",
    display: "block",
  },

  heartBtn: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.95)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
    transition: "transform 0.2s ease",
  },

  editBtn: {
    position: "absolute",
    top: "12px",
    right: "54px",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.95)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
  },

  deleteBtn: {
    position: "absolute",
    top: "12px",
    right: "96px",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.95)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
  },

  info: {
    marginTop: "12px",
    padding: "0 4px",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "8px",
  },

  title: {
    margin: "0",
    fontSize: "16px",
    fontWeight: "600",
    lineHeight: 1.35,
  },

  rating: {
    fontSize: "14px",
    fontWeight: "600",
    display: "inline-flex",
    alignItems: "center",
    flexShrink: 0,
  },

  location: {
    color: "#717171",
    fontSize: "14px",
    margin: "6px 0 0",
  },

  meta: {
    fontSize: "13px",
    color: "#717171",
    marginTop: "6px",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "6px",
  },

  metaItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },

  metaDot: {
    opacity: 0.5,
  },

  price: {
    fontWeight: "600",
    marginTop: "8px",
    fontSize: "15px",
  },

  perNight: {
    fontWeight: "normal",
    color: "#717171",
    fontSize: "14px",
  },
};
