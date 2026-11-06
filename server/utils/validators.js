// Email Validation
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Password Validation (min 6 chars)
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Required Fields Check
export const validateRequired = (fields = {}) => {
  for (let key in fields) {
    if (!fields[key]) {
      return `${key} is required`;
    }
  }
  return null;
};

// Price Validation
export const validatePrice = (price) => {
  return price > 0;
};

// Date Validation
export const validateDates = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  return new Date(endDate) > new Date(startDate);
};