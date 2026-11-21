const express = require("express");

const router = express.Router();

const {
  registerProgram,
  cancelRegistration,
  getMyRegistrations,
  getAllRegistrations
} = require("../controllers/registrationController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Employee Routes

router.post(
  "/",
  authMiddleware,
  authorizeRoles("EMPLOYEE"),
  registerProgram
);

router.get(
  "/my",
  authMiddleware,
  authorizeRoles("EMPLOYEE"),
  getMyRegistrations
);

router.put(
  "/cancel/:id",
  authMiddleware,
  authorizeRoles("EMPLOYEE"),
  cancelRegistration
);

// Admin Route

router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  getAllRegistrations
);

module.exports = router;