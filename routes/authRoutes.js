const express = require("express");
const router = express.Router();

const {
  signup,
  verifyOTP,
  resendOTP,
  login,
  refreshToken,
  logout,
  getProfile,
} = require("../controllers/authController");

const {
  validateSignup,
  validateLogin,
  validateVerifyOTP,
  validateResendOTP,
} = require("../validators/authValidator");

const { authenticate, authorize } = require("../middlewares/authMiddleware");

// Public routes
router.post("/signup", validateSignup, signup);
router.post("/verify-otp", validateVerifyOTP, verifyOTP);
router.post("/resend-otp", validateResendOTP, resendOTP);
router.post("/login", validateLogin, login);
router.post("/refresh-token", refreshToken);

// Protected routes
router.post("/logout", authenticate, logout);
router.get("/profile", authenticate, getProfile);

// Admin only route example
router.get("/admin-only", authenticate, authorize("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin!",
    data: { userId: req.user.userId, role: req.user.role },
  });
});
console.log("✅ authRoutes file loaded");

module.exports = router;
