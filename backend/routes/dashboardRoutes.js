const express = require("express");

const router = express.Router();

const {
  getDashboardStats
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Admin Only Dashboard

router.get(
  "/stats",
  authMiddleware,
  authorizeRoles("ADMIN"),
  getDashboardStats
);

module.exports = router;