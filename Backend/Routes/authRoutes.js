const express = require("express");
const passport = require("passport");
const router = express.Router();

// Initiate Google Login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.json({
      token: req.user.token,
      username: req.user.user.username,
      role: req.user.user.role,
    });
  }
);

module.exports = router;
