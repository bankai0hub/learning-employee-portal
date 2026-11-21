const express = require("express");

const router = express.Router();

const {
  addAssessment,
  updateAssessment,
  getMyAssessments,
  getAllAssessments
} = require("../controllers/assessmentController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Admin

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  addAssessment
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  updateAssessment
);

router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  getAllAssessments
);

// Employee

router.get(
  "/my",
  authMiddleware,
  authorizeRoles("EMPLOYEE"),
  getMyAssessments
);

module.exports = router;