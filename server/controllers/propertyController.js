import Property from "../models/Property.js";

// 🔥 CREATE PROPERTY
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      price,
      images,
      category,
      guests,
      bedrooms,
      bathrooms,
      amenities,
    } = req.body;

    // 🧠 Validation (basic but important)
    if (!title || !location || !price) {
      return res.status(400).json({
        message: "Title, location and price are required",
      });
    }

    const property = await Property.create({
      title,
      description,
      location,
      price,
      images: images || [],
      category,
      guests,
      bedrooms,
      bathrooms,
      amenities: amenities || [],
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Create property failed",
      error: error.message,
    });
  }
};



// 🔥 GET ALL PROPERTIES (with filters + search)
export const getProperties = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, category } = req.query;

    let query = {};

    // 🔍 Filters
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const normalized = properties.map((p) => {
      const obj = p.toObject();
      return {
        ...obj,
        owner: obj.user,
      };
    });

    res.status(200).json({
      success: true,
      count: normalized.length,
      properties: normalized,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetch failed",
      error: error.message,
    });
  }
};



// 🔥 GET SINGLE PROPERTY
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetch failed",
      error: error.message,
    });
  }
};



// 🔥 UPDATE PROPERTY
export const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const isAdmin = req.user?.role === "admin";

    // 🔐 Ownership check (admin can edit any property)
    if (!isAdmin && property.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Property updated",
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};



// 🔥 DELETE PROPERTY
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const isAdmin = req.user?.role === "admin";

    // 🔐 Ownership check (admin can delete any property)
    if (!isAdmin && property.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};

// 🔥 GET MY PROPERTIES (ADMIN)
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ user: req.user._id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const normalized = properties.map((p) => {
      const obj = p.toObject();
      return {
        ...obj,
        owner: obj.user,
      };
    });

    res.status(200).json({
      success: true,
      count: normalized.length,
      properties: normalized,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetch failed",
      error: error.message,
    });
  }
};