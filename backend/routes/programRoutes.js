const express = require("express");

const router = express.Router();

const {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
} = require("../controllers/programController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// View Programs (Admin + Employee)

router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "EMPLOYEE"),
  getPrograms
);

router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "EMPLOYEE"),
  getProgramById
);

// Admin Only

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  createProgram
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  updateProgram
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  deleteProgram
);

module.exports = router;