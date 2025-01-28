import validator from "validator";

export const validateName = (name) => {
  if (!name) return "Name is required";
  if (name.length < 3 || name.length > 30) {
    return "Name must be between 3 and 30 characters";
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return "Name can only contain letters, spaces, hyphens, and apostrophes";
  }
  return ""; // No error
};

export const validateEmail = (email) => {
  if (!email) return "Email is required";
  if (!validator.isEmail(email)) {
    return "Invalid email format";
  }

  if (email.length > 50) {
    return "Email must be less than 50 characters";
  }
  if (email.length < 5) {
    return "Email must be at least 5 characters long";
  }
  return ""; // No error
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) {
    return "Password must be at least 6 characters long";
  }
  if (password.length > 50) {
    return "Password must be less than 50 characters";
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/(?=.*[0-9])/.test(password)) {
    return "Password must contain at least one number";
  }
  if (!/(?=.*[!@#$%^&*])/.test(password)) {
    return "Password must contain at least one special character";
  }
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Retype your password";
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return ""; // No error
};
