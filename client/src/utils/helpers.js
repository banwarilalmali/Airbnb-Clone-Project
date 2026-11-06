/* =========================
   🔥 STRING UTILITIES
========================= */

// Capitalize first letter
export const capitalize = (text = "") => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Truncate long text
export const truncate = (text = "", maxLength = 100) => {
  if (!text) return "";
  return text.length > maxLength
    ? text.substring(0, maxLength) + "..."
    : text;
};

/* =========================
   💰 PRICE FORMATTER
========================= */

export const formatPrice = (amount = 0, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

/* =========================
   📅 DATE UTILITIES
========================= */

// Format date (DD MMM YYYY)
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Calculate number of days between dates
export const getDaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const diff = new Date(endDate) - new Date(startDate);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/* =========================
   📦 ARRAY UTILITIES
========================= */

// Remove duplicates
export const uniqueArray = (arr = []) => {
  return [...new Set(arr)];
};

/* =========================
   🔍 VALIDATION UTILITIES
========================= */

// Email validation
export const isValidEmail = (email = "") => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Check empty object
export const isEmptyObject = (obj = {}) => {
  return Object.keys(obj).length === 0;
};

/* =========================
   ⚡ DEBOUNCE (Performance)
========================= */

export const debounce = (func, delay = 500) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

/* =========================
   📦 LOCAL STORAGE HELPERS
========================= */

export const setLocalStorage = (key, value) => {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
      return;
    }
    // JWT / opaque strings must stay raw (matches api.js + axios patterns)
    if (key === "token" && typeof value === "string") {
      localStorage.setItem(key, value);
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("LocalStorage Set Error:", error);
  }
};

export const getLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    if (data === null || data === "") return null;
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  } catch (error) {
    console.error("LocalStorage Get Error:", error);
    return null;
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("LocalStorage Remove Error:", error);
  }
}; 
