const express = require("express");
const router = express.Router();

const { AdminSigUp, AdminLogin, UserSigUp, UserLogin, verifyAdminOTP, verifyUserOTP } = require("../Controllers/AuthenticationController");

// admin
router.post("/admin-signup", AdminSigUp);
router.post("/admin-login", AdminLogin);
router.post("/verify-admin-login-otp", verifyAdminOTP);

// user
router.post("/user-signup", UserSigUp);
router.post("/user-login", UserLogin);
router.post("/verify-user-login-otp", verifyUserOTP);


module.exports = router;