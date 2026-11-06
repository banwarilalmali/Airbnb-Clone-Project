import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPropertyById,
  updateProperty,
} from "../services/propertyService";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    guests: 1,
    bedrooms: 1,
    bathrooms: 1,
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔥 Fetch existing property
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPropertyById(id);
        const p = res.property;

        setForm({
          title: p.title || "",
          description: p.description || "",
          location: p.location || "",
          price: p.price || "",
          guests: p.guests || 1,
          bedrooms: p.bedrooms || 1,
          bathrooms: p.bathrooms || 1,
        });

        setPreview(p.images || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🔄 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📸 Handle image select
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previewUrls = files.map((file) =>
      URL.createObjectURL(file)
    );
    setPreview(previewUrls);
  };

  // 🚀 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();

      // 🔥 Add fields
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      // 🔥 Add images (optional replace)
      images.forEach((img) => {
        formData.append("images", img);
      });

      await updateProperty(id, formData);

      alert("Property updated successfully 🔥");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Update failed ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;

  return (
    <div style={styles.container}>
      <h2>Edit Property</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />

        <input
          type="number"
          name="guests"
          value={form.guests}
          onChange={handleChange}
          placeholder="Guests"
        />

        <input
          type="number"
          name="bedrooms"
          value={form.bedrooms}
          onChange={handleChange}
          placeholder="Bedrooms"
        />

        <input
          type="number"
          name="bathrooms"
          value={form.bathrooms}
          onChange={handleChange}
          placeholder="Bathrooms"
        />

        {/* 📸 Image Upload */}
        <input type="file" multiple onChange={handleImageChange} />

        {/* 🖼️ Preview */}
        <div style={styles.preview}>
          {preview.map((img, i) => (
            <img key={i} src={img} alt="" style={styles.img} />
          ))}
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update Property"}
        </button>
      </form>
    </div>
  );
};

export default EditProperty;



// 🎨 Styles
const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  preview: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  img: {
    width: "100px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "6px",
  },
};