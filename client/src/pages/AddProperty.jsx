import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../services/propertyService";
import {
  PlusCircle,
  PencilLine,
  MapPin,
  IndianRupee,
  Image as ImageIcon,
  Home,
  Users,
  BedDouble,
  Bath,
  Sparkles,
  Loader2,
} from "lucide-react";

const AddProperty = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    image: "",
    category: "apartment",
    guests: "1",
    bedrooms: "1",
    bathrooms: "1",
    amenities: "",
  });

  const [loading, setLoading] = useState(false);

  // 🧠 Handle Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🚀 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const dataToSend = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: Number(formData.price),
        category: formData.category,
        guests: Number(formData.guests) || 1,
        bedrooms: Number(formData.bedrooms) || 1,
        bathrooms: Number(formData.bathrooms) || 1,
        images: formData.image ? [formData.image.trim()] : [],
        amenities: formData.amenities
          ? formData.amenities.split(",").map((a) => a.trim()).filter(Boolean)
          : [],
      };

      await createProperty(dataToSend);

      alert("✅ Property Added Successfully!");

      navigate("/"); // redirect to home
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ap-shell">
      <div className="ap-card">
        <div className="ap-header">
          <div className="ap-badge">
            <Sparkles size={18} strokeWidth={2} />
            <span>Host</span>
          </div>
          <h2 className="ap-title">Add Property</h2>
          <p className="ap-subtitle">Create a beautiful listing in seconds.</p>
        </div>

        <form onSubmit={handleSubmit} className="ap-form">
          <div className="ap-grid">
            <label className="ap-field ap-span-2">
              <span className="ap-label">
                <PencilLine size={16} strokeWidth={2} />
                Title
              </span>
              <input
                name="title"
                placeholder="e.g. Luxury Villa Goa"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </label>

            <label className="ap-field ap-span-2">
              <span className="ap-label">
                <PencilLine size={16} strokeWidth={2} />
                Description
              </span>
              <textarea
                name="description"
                placeholder="Tell guests what makes your place special…"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </label>

            <label className="ap-field">
              <span className="ap-label">
                <MapPin size={16} strokeWidth={2} />
                Location
              </span>
              <input
                name="location"
                placeholder="e.g. Goa"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </label>

            <label className="ap-field">
              <span className="ap-label">
                <IndianRupee size={16} strokeWidth={2} />
                Price (per night)
              </span>
              <input
                name="price"
                type="number"
                min={1}
                placeholder="e.g. 2500"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </label>

            <label className="ap-field ap-span-2">
              <span className="ap-label">
                <ImageIcon size={16} strokeWidth={2} />
                Cover Image URL
              </span>
              <input
                name="image"
                placeholder="https://..."
                value={formData.image}
                onChange={handleChange}
              />
            </label>

            <label className="ap-field">
              <span className="ap-label">
                <Home size={16} strokeWidth={2} />
                Category
              </span>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="room">Room</option>
              </select>
            </label>

            <label className="ap-field">
              <span className="ap-label">
                <Users size={16} strokeWidth={2} />
                Guests
              </span>
              <input
                name="guests"
                type="number"
                min={1}
                placeholder="1"
                value={formData.guests}
                onChange={handleChange}
              />
            </label>

            <label className="ap-field">
              <span className="ap-label">
                <BedDouble size={16} strokeWidth={2} />
                Bedrooms
              </span>
              <input
                name="bedrooms"
                type="number"
                min={1}
                placeholder="1"
                value={formData.bedrooms}
                onChange={handleChange}
              />
            </label>

            <label className="ap-field">
              <span className="ap-label">
                <Bath size={16} strokeWidth={2} />
                Bathrooms
              </span>
              <input
                name="bathrooms"
                type="number"
                min={1}
                placeholder="1"
                value={formData.bathrooms}
                onChange={handleChange}
              />
            </label>

            <label className="ap-field ap-span-2">
              <span className="ap-label">
                <Sparkles size={16} strokeWidth={2} />
                Amenities
              </span>
              <input
                name="amenities"
                placeholder="wifi, parking, pool (comma separated)"
                value={formData.amenities}
                onChange={handleChange}
              />
              <span className="ap-hint">Tip: use commas to add multiple amenities.</span>
            </label>
          </div>

          <div className="ap-actions">
            <button
              type="button"
              className="ap-btn ap-btn-ghost"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Back
            </button>

            <button type="submit" className="ap-btn ap-btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="page-spinner" />
                  <span>Adding…</span>
                </>
              ) : (
                <>
                  <PlusCircle size={18} strokeWidth={2} />
                  <span>Add Property</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;