const express = require("express");
const { googleLogin, demoLogin, logout ,getMe} = require("../controllers/authController");
const { requireAuth} = require("../middleware/auth");
const router = express.Router();

router.post("/google", googleLogin);
router.post("/demo", demoLogin);
router.post("/logout", logout);
router.get("/me", requireAuth, getMe);

module.exports = router;
