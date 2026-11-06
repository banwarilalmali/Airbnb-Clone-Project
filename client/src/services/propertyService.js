import api from "./api";

// 🔧 Common error handler
const handleError = (error, label) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong";

  console.error(`${label}:`, message);
  throw new Error(message);
};

// 🔍 Get All Properties (filters + future pagination ready)
export const getAllProperties = async (params = {}) => {
  try {
    const res = await api.get("/properties", {
      params,
    });

    return {
      properties: res.data?.properties || [],
      total: res.data?.total ?? res.data?.count ?? 0,
    };
  } catch (error) {
    handleError(error, "Get Properties Error");
  }
};

// 🔍 Get My Properties (Admin)
export const getMyProperties = async () => {
  try {
    const res = await api.get("/properties/my");
    return {
      properties: res.data?.properties || [],
      total: res.data?.count || 0,
    };
  } catch (error) {
    handleError(error, "Get My Properties Error");
  }
};

// 🔍 Get Single Property
export const getPropertyById = async (id) => {
  try {
    const res = await api.get(`/properties/${id}`);

    return {
      property: res.data?.property || res.data,
    };
  } catch (error) {
    handleError(error, "Get Property Error");
  }
};

// ➕ Create Property (with images)
export const createProperty = async (data) => {
  try {
    const res = await api.post("/properties", data);

    return {
      success: true,
      property: res.data,
    };
  } catch (error) {
    handleError(error, "Create Property Error");
  }
};

// ✏️ Update Property
export const updateProperty = async (id, data) => {
  try {
    const res = await api.put(`/properties/${id}`, data);

    return {
      success: true,
      property: res.data,
    };
  } catch (error) {
    handleError(error, "Update Property Error");
  }
};

// ❌ Delete Property
export const deleteProperty = async (id) => {
  try {
    const res = await api.delete(`/properties/${id}`);

    return {
      success: true,
      message: res.data?.message || "Deleted successfully",
    };
  } catch (error) {
    handleError(error, "Delete Property Error");
  }
};