const express = require("express");

const router = express.Router();

const {
  markAttendance,
  updateAttendance,
  getMyAttendance,
  getProgramAttendance
} = require("../controllers/attendanceController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  markAttendance
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  updateAttendance
);

router.get(
  "/program/:programId",
  authMiddleware,
  authorizeRoles("ADMIN"),
  getProgramAttendance
);

router.get(
  "/my",
  authMiddleware,
  authorizeRoles("EMPLOYEE"),
  getMyAttendance
);

module.exports = router;