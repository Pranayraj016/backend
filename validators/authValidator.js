const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  // Name validation
  if (!name || name.trim().length === 0) {
    errors.push("Name is required");
  } else if (name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  } else if (name.trim().length > 50) {
    errors.push("Name must not exceed 50 characters");
  }

  // Email validation
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!emailRegex.test(email)) {
    errors.push("Please provide a valid email address");
  }

  // Password validation
  if (!password) {
    errors.push("Password is required");
  } else {
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  }

  if (!password || password.length === 0) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

const validateVerifyOTP = (req, res, next) => {
  const { email, otp } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  }

  if (!otp) {
    errors.push("OTP is required");
  } else if (!/^\d{6}$/.test(otp.toString())) {
    errors.push("OTP must be a 6-digit number");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

const validateResendOTP = (req, res, next) => {
  const { email } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateVerifyOTP,
  validateResendOTP,
};
