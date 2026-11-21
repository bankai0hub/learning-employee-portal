const express = require("express");

const router = express.Router();

const {
  submitFeedback,
  getMyFeedback,
  getAllFeedback
} = require("../controllers/feedbackController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// Employee

router.post(
  "/",
  authMiddleware,
  authorizeRoles("EMPLOYEE"),
  submitFeedback
);

router.get(
  "/my",
  authMiddleware,
  authorizeRoles("EMPLOYEE"),
  getMyFeedback
);


// Admin

router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  getAllFeedback
);

module.exports = router;